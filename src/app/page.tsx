import { FloatingGallery } from "@/components/site/floating-gallery";
import { getHomepageContent, getPublishedArtworks } from "@/lib/cms/queries";

export const revalidate = 60;

export default async function HomePage() {
  const [artworks, content] = await Promise.all([getPublishedArtworks(), getHomepageContent()]);

  return <FloatingGallery artworks={artworks} content={content} />;
}
