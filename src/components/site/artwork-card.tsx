import Link from "next/link";
import { ArtworkImage } from "@/components/site/artwork-image";
import { formatMoney } from "@/lib/utils";
import type { Artwork } from "@/types/cms";

export function ArtworkCard({ artwork, index = 0 }: { artwork: Artwork; index?: number }) {
  return (
    <Link
      href={`/artworks/${artwork.slug}`}
      className="grid-card animate-fadeUp"
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      <ArtworkImage artwork={artwork} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/85" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        {artwork.featured ? <span className="tag mb-2 text-[9px]">Featured</span> : null}
        <h3 className="font-serif text-xl font-light tracking-[0.01em] text-gallery-ink">
          {artwork.title}
        </h3>
        <div className="mt-2 flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.08em] text-gallery-muted">
          <span>{artwork.category}</span>
          <span>{formatMoney(artwork.price, artwork.currency)}</span>
        </div>
      </div>
    </Link>
  );
}
