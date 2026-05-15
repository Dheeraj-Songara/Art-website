import Image from "next/image";
import { artGradients } from "@/lib/cms/fallback-data";
import { cn } from "@/lib/utils";
import type { Artwork } from "@/types/cms";

type ArtworkImageProps = {
  artwork: Artwork;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
};

export function ArtworkImage({
  artwork,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 44vw, 92vw",
  fill = true
}: ArtworkImageProps) {
  const imageUrl = artwork.imageUrl ?? artwork.thumbnailUrl;

  if (imageUrl) {
    if (fill) {
      return (
        <Image
          src={imageUrl}
          alt={artwork.title}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", className)}
          placeholder={artwork.blurDataUrl ? "blur" : "empty"}
          blurDataURL={artwork.blurDataUrl ?? undefined}
        />
      );
    }

    return (
      <Image
        src={imageUrl}
        alt={artwork.title}
        width={1200}
        height={1500}
        priority={priority}
        sizes={sizes}
        className={cn("h-full w-full object-cover", className)}
        placeholder={artwork.blurDataUrl ? "blur" : "empty"}
        blurDataURL={artwork.blurDataUrl ?? undefined}
      />
    );
  }

  const gradient = artGradients[artwork.gradientIndex % artGradients.length] ?? artGradients[0];

  return (
    <div
      aria-label={artwork.title}
      role="img"
      className={cn("relative h-full w-full overflow-hidden", className)}
      style={{ background: gradient.bg }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_25%,rgba(255,255,255,0.1)_0%,transparent_55%),radial-gradient(ellipse_at_75%_75%,rgba(0,0,0,0.5)_0%,transparent_55%)]" />
      <div
        className="absolute left-[22%] top-[22%] h-[55%] w-[55%] rounded-full blur-[20px]"
        style={{ background: `radial-gradient(circle, ${gradient.hi}28 0%, transparent 70%)` }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-black/45 to-transparent" />
    </div>
  );
}
