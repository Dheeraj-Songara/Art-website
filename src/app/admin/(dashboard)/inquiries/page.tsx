import { AdminInquiriesManager } from "@/components/admin/admin-inquiries-manager";
import { getInquiries } from "@/lib/cms/queries";

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <main className="p-5 md:p-8">
      <AdminInquiriesManager inquiries={inquiries} />
    </main>
  );
}
