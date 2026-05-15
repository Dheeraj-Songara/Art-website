import type { Metadata } from "next";
import { CollectionExplorer } from "@/components/site/collection-explorer";
import { getCollections, getPublishedArtworks, getSiteSettings } from "@/lib/cms/queries";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: "Collections",
    description: `Explore curated digital art collections from ${settings.siteName}.`
  };
}

export default async function CollectionsPage() {
  const [artworks, collections] = await Promise.all([getPublishedArtworks(), getCollections()]);

  return (
    <main className="min-h-[calc(100vh-60px)] px-5 py-12 md:px-10 md:py-16">
      <CollectionExplorer artworks={artworks} collections={collections} />
    </main>
  );
}
