import { AdminEmptyConfig } from "@/components/admin/admin-empty-config";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth";

export default async function AdminDashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const status = await requireAdmin();

  if (!status.configured) {
    return <AdminEmptyConfig />;
  }

  return (
    <div className="lg:flex">
      <AdminNav email={status.email} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
