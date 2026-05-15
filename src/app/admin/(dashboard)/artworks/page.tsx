import { AdminArtworksManager } from "@/components/admin/admin-artworks-manager";
import { getAdminArtworks, getCollections } from "@/lib/cms/queries";

export default async function AdminArtworksPage() {
  const [artworks, collections] = await Promise.all([getAdminArtworks(), getCollections()]);

  return (
    <main className="p-5 md:p-8">
      <AdminArtworksManager initialArtworks={artworks} collections={collections} />
    </main>
  );
}
