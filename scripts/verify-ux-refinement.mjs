import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const checks = [];

async function source(path) {
  return readFile(resolve(root, path), "utf8");
}

function check(name, passed, detail) {
  checks.push({ name, status: passed ? "PASS" : "FAIL", detail });
}

const [schema, migration, productAction, productMutationService, productRoutes, brandAction, catalog, productForm, mobileNavigation, heroManager, heroAction, heroRoute, categorySection, productCard] = await Promise.all([
  source("prisma/schema.prisma"),
  source("prisma/migrations/20261005170000_normalize_brands_storage_hero/migration.sql"),
  source("src/actions/admin-products.ts"),
  source("src/lib/admin-product-mutations.ts"),
  Promise.all([
    source("src/app/api/admin/products/route.ts"),
    source("src/app/api/admin/products/[id]/route.ts"),
  ]).then((routes) => routes.join("\n")),
  source("src/actions/admin-brands.ts"),
  source("src/lib/catalog-data.ts"),
  source("src/components/admin/product-form.tsx"),
  source("src/components/storefront/mobile-navigation.tsx"),
  source("src/components/admin/hero-image-manager.tsx"),
  source("src/actions/admin-settings.ts"),
  source("src/app/api/admin/settings/hero/upload-signature/route.ts"),
  source("src/components/storefront/category-section.tsx"),
  source("src/components/storefront/product-card.tsx"),
]);
const themeSources = (await Promise.all([
  "src/components/catalog/catalog-toolbar.tsx",
  "src/components/catalog/catalog-filters.tsx",
  "src/components/catalog/catalog-pagination.tsx",
  "src/components/admin/product-filters.tsx",
  "src/components/admin/order-status-form.tsx",
  "src/app/admin/(protected)/orders/page.tsx",
].map(source))).join("\n");

check("Normalized Brand model", schema.includes("model Brand") && schema.includes("brandId") && schema.includes("onDelete: Restrict"), "required Product relation with restrictive deletion");
check("Ordered laptop storage rows", schema.includes("model LaptopStorage") && schema.includes("@@unique([productId, sortOrder])"), "multiple ordered child rows");
check("Data-preserving migration", migration.includes("INSERT INTO \"Brand\"") && migration.includes("INSERT INTO \"LaptopStorage\"") && migration.includes("RAISE EXCEPTION") && !migration.includes("DELETE FROM \"Product\""), "backfill assertions present; no Product deletion");
check("Brand CRUD protection", brandAction.includes("_count.products") && brandAction.includes("لا يمكن حذف") && brandAction.includes("normalizedName"), "duplicate prevention and in-use deletion block");
check("Brand CRUD actions", brandAction.includes("saveBrand") && brandAction.includes("brand.create") && brandAction.includes("brand.update") && brandAction.includes("brand.delete"), "create, rename and guarded delete actions are present");
check("Required brand and storage validation", productMutationService.includes("postgresUuidSchema") && productMutationService.includes("storageSchema") && productMutationService.includes("laptopStorage.createMany"), "PostgreSQL UUID validation, server-authoritative validation and ordered persistence");
check("Product JSON mutations", productRoutes.includes("Response.json") && productRoutes.includes("VALIDATION_ERROR") && productRoutes.includes("fieldErrors"), "create/update mutations return structured JSON responses");
check("Product editor UX", productForm.includes('name="brandId"') && productForm.includes("storages") && productForm.includes("validationErrors") && productForm.includes("data-field"), "brand select, repeatable storage, inline errors and focus target");
check("Duplicate name remains non-blocking", productForm.includes("duplicate-product-warning") && productForm.includes("يمكنك المتابعة") && productForm.includes("/edit`") && !productAction.match(/createProduct[\s\S]{0,500}findProductsByExactName/u), "warning and existing-product edit link do not gate Create");
check("Required field feedback", productForm.includes("هذا الحقل مطلوب") && productForm.includes("aria-invalid") && productForm.includes("focusField(form"), "empty fields show inline errors and focus the first invalid control");
check("ANY storage filters", catalog.includes("storages: { some: { capacityGB") && catalog.includes("storages: { some: { type"), "capacity and type match any child row");
check("Brand URL contract retained", catalog.includes("name: { in: state.brand") && catalog.includes("brands: sortText"), "public query values remain brand names");
check("Mobile menu lifecycle", mobileNavigation.includes("cursor-pointer") && mobileNavigation.includes("open={open}") && mobileNavigation.includes("onOpenChange={setOpen}") && mobileNavigation.includes("onClick={() => setOpen(false)}") && mobileNavigation.includes("menuPath === pathname"), "controlled Sheet delegates outside/Escape listeners and closes for navigation/path changes");
check("Managed Hero upload", heroManager.includes("onDrop=") && heroAction.includes("verifyManagedHeroImage") && heroAction.includes("destroyManagedHeroImage") && heroRoute.includes("getCloudinaryHeroUploadSignature"), "preview/replace/remove with signed, verified, exact cleanup lifecycle");
check("Hero namespace enforcement", (await source("src/lib/cloudinary.ts")).includes("heroImagePrefix(settingsId)") && (await source("src/lib/cloudinary.ts")).includes('!publicId.slice(prefix.length).includes("/")'), "exact settings-scoped public IDs only");
check("Interactive palette", !themeSources.includes("bg-foreground text-white") && !themeSources.includes("bg-[#171717]") && themeSources.includes("bg-brand-indigo"), "interactive selections/actions use the brand palette");
check("Responsive category grid", categorySection.includes("grid-cols-2") && categorySection.includes("max-[359px]:grid-cols-1") && categorySection.includes("lg:grid-cols-6"), "390/768 use two columns; 1280 uses desktop layout");
check("Compact mobile product cards", productCard.includes("aspect-[2.05]") && productCard.includes("line-clamp-2") && productCard.includes("sm:aspect-[1.55]"), "mobile density with desktop restoration");
check("Product card overflow guard", productCard.includes("min-w-0") && productCard.includes("overflow-hidden") && productCard.includes("break-words"), "long technical values cannot force horizontal overflow");

for (const item of checks) console.log(`${item.status} ${item.name}: ${item.detail}`);
const failed = checks.filter((item) => item.status === "FAIL");
console.log(`${failed.length ? "FAIL" : "PASS"} Static implementation verification: ${checks.length - failed.length}/${checks.length} checks passed.`);
console.log("BLOCKED Production/runtime verification: no database migration, authenticated target, or production mutation was requested; this verifier does not apply migrations or alter production data.");
process.exitCode = failed.length ? 1 : 0;
