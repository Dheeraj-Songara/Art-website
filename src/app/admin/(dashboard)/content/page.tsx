import { AdminContentManager } from "@/components/admin/admin-content-manager";
import {
  getAboutContent,
  getContactInfo,
  getHomepageContent,
  getSiteSettings,
  getSocialLinks
} from "@/lib/cms/queries";

export default async function AdminContentPage() {
  const [homepage, about, contact, settings, socialLinks] = await Promise.all([
    getHomepageContent(),
    getAboutContent(),
    getContactInfo(),
    getSiteSettings(),
    getSocialLinks()
  ]);

  return (
    <main className="p-5 md:p-8">
      <AdminContentManager
        homepage={homepage}
        about={about}
        contact={contact}
        settings={settings}
        socialLinks={socialLinks}
      />
    </main>
  );
}
