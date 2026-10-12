import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export default async function AdminSettingsPage() {
  await requireAdmin();

  const settings = await prisma.siteSettings.findFirst({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      storeName: true,
      usdToSypRate: true,
      phone: true,
      whatsapp: true,
      facebook: true,
      instagram: true,
      heroEnabled: true,
      heroTitleAr: true,
      heroTitleEn: true,
      heroSubtitleAr: true,
      heroSubtitleEn: true,
      heroImageUrl: true,
      heroImagePublicId: true,
    },
  });

  if (!settings) {
    return <section className="rounded-2xl border border-dashed border-black/15 bg-white p-6"><p className="text-sm font-bold">إعدادات المتجر غير مهيأة بعد.</p><p className="mt-2 text-sm text-muted-foreground">لا يتم إنشاء إعدادات جديدة تلقائياً لتجنب تكرار سجل الإعدادات.</p></section>;
  }

  return <div><div><p className="text-sm font-semibold text-muted-foreground">إدارة المتجر</p><h2 className="mt-1 text-3xl font-semibold tracking-[-0.045em]">الإعدادات</h2><p className="mt-2 text-sm text-muted-foreground">إعدادات الأسعار ومعلومات التواصل ومحتوى الصفحة الرئيسية.</p></div><div className="mt-7 max-w-4xl"><SiteSettingsForm settings={settings} /></div></div>;
}
