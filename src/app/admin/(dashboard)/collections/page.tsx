import { AdminCollectionsManager } from "@/components/admin/admin-collections-manager";
import { getCollections } from "@/lib/cms/queries";

export default async function AdminCollectionsPage() {
  const collections = await getCollections();

  return (
    <main className="p-5 md:p-8">
      <AdminCollectionsManager collections={collections} />
    </main>
  );
}
