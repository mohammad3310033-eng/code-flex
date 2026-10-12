import "dotenv/config";
import { PrismaClient } from "../../src/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const forbiddenMetadataKeys = new Set(["customername", "name", "customerphone", "phone", "city", "note"]);

function collectMetadataKeys(value, keys) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectMetadataKeys(item, keys));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, nested]) => {
      keys.add(key.toLowerCase());
      collectMetadataKeys(nested, keys);
    });
  }
}

export function createVerifierDatabase() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return undefined;
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

export async function verifyReadOnlyDatabase(prisma) {
  const [settings, orderCount, completedOrderCount, eventGroups, metadataRows] = await Promise.all([
    prisma.siteSettings.findMany({ select: { id: true }, orderBy: { createdAt: "asc" } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "COMPLETED" } }),
    prisma.analyticsEvent.groupBy({ by: ["eventType"], _count: { _all: true } }),
    prisma.analyticsEvent.findMany({ select: { metadata: true } }),
  ]);

  const metadataKeys = new Set();
  metadataRows.forEach((event) => collectMetadataKeys(event.metadata, metadataKeys));
  const hasPiiMetadata = [...metadataKeys].some((key) => forbiddenMetadataKeys.has(key));
  const snapshot = {
    siteSettingsCount: settings.length,
    orderCount,
    completedOrderCount,
    analyticsRowsChecked: metadataRows.length,
    piiMetadataViolations: hasPiiMetadata ? 1 : 0,
    analytics: Object.fromEntries(eventGroups.map((group) => [group.eventType, group._count._all])),
  };

  if (settings.length !== 1) return { status: "FAIL", detail: `expected exactly one SiteSettings row, found ${settings.length}`, snapshot };
  if (hasPiiMetadata) return { status: "FAIL", detail: "analytics metadata contains a prohibited customer-data key", snapshot };

  return {
    status: "PASS",
    detail: `${orderCount} orders; analytics event groups verified without PII metadata keys`,
    snapshot,
  };
}

export async function getMutationSeed(prisma) {
  const [settings, product] = await Promise.all([
    prisma.siteSettings.findMany({ select: { id: true, usdToSypRate: true }, orderBy: { createdAt: "asc" } }),
    prisma.product.findFirst({
      where: { isActive: true },
      select: { id: true, slug: true, name: true, categoryId: true, priceUsdCents: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);
  if (settings.length !== 1) throw new Error(`expected exactly one SiteSettings row, found ${settings.length}`);
  if (!product) throw new Error("no active Product exists for guarded mutation verification");
  return { settings: settings[0], product };
}

export async function waitForDatabase(check, { timeoutMs = 30_000, intervalMs = 500 } = {}) {
  const deadline = Date.now() + timeoutMs;
  let last;
  while (Date.now() < deadline) {
    last = await check();
    if (last) return last;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return undefined;
}

export async function cleanupMutationArtifacts(prisma, state) {
  const results = { settingsRestored: false, temporaryOrderResidual: 0, temporaryAnalyticsResidual: 0 };
  if (state.settings?.id && Number.isInteger(state.settings.originalRate)) {
    await prisma.siteSettings.update({ where: { id: state.settings.id }, data: { usdToSypRate: state.settings.originalRate } });
    const restored = await prisma.siteSettings.findUnique({ where: { id: state.settings.id }, select: { usdToSypRate: true } });
    results.settingsRestored = restored?.usdToSypRate === state.settings.originalRate;
  }
  if (state.orderId) await prisma.order.deleteMany({ where: { id: state.orderId } });
  if (state.visitorId && state.sessionId) {
    await prisma.analyticsEvent.deleteMany({ where: { visitorId: state.visitorId, sessionId: state.sessionId } });
  }
  if (state.orderId) results.temporaryOrderResidual = await prisma.order.count({ where: { id: state.orderId } });
  if (state.visitorId && state.sessionId) {
    results.temporaryAnalyticsResidual = await prisma.analyticsEvent.count({ where: { visitorId: state.visitorId, sessionId: state.sessionId } });
  }
  return results;
}
