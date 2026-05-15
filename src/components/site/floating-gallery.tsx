"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArtworkImage } from "@/components/site/artwork-image";
import { ArtworkModal } from "@/components/site/artwork-modal";
import type { Artwork, HomepageContent } from "@/types/cms";

const floatConfig = [
  // Left column
  { top: "2%",   left: "1%",         width: 220, height: 170, z: 2 },
  { top: "22%",  left: "14%",        width: 250, height: 195, z: 3 },
  { top: "52%",  left: "2%",         width: 200, height: 250, z: 2 },
  { top: "74%",  left: "18%",        width: 215, height: 170, z: 3 },

  // Right column — pushed closer to the edge to eliminate the gap
  { top: "1%",   right: "0%",        width: 240, height: 180, z: 2 },
  { top: "24%",  right: "0%",        width: 260, height: 310, z: 3 },
  { top: "65%",  right: "0%",        width: 230, height: 175, z: 2 },

  // Second right column — fills the visible gap between featured and edge
  { top: "4%",   right: "17%",       width: 200, height: 220, z: 1 },
  { top: "55%",  right: "16%",       width: 210, height: 160, z: 1 },

  // Mid-left background filler
  { top: "70%",  left: "36%",        width: 200, height: 150, z: 1 },
];

/**
 * Generate a looping drift path for a card.
 * - Small, bounded x/y offsets so cards never leave the viewport.
 * - No scale, no rotation → no clipping artifacts, no zoom, no squeeze.
 * - Each card gets a unique phase & amplitude so they feel independent.
 */
function getDriftAnimation(index: number) {
  // Larger drift range for visible, lively movement.
  // Cards are positioned with enough margin that ±30–40 px never clips into
  // the featured card or viewport edge.
  const xAmp = 24 + (index % 4) * 8;   // 24 | 32 | 40 | 48
  const yAmp = 20 + (index % 5) * 6;   // 20 | 26 | 32 | 38 | 44
  const dur  = 7 + index * 1.4;         // 7 s … 21 s — noticeably faster

  // Six-waypoint path for more organic, wandering feel.
  return {
    animate: {
      x: [0,  xAmp, xAmp * 0.4, -xAmp * 0.6, -xAmp, 0],
      y: [0, -yAmp * 0.5, yAmp, yAmp * 0.3, -yAmp * 0.7, 0],
    },
    transition: {
      duration: dur,
      repeat: Infinity,
      ease: "easeInOut",
      delay: index * 0.7,   // tighter stagger so they desync quickly
    },
  };
}

export function FloatingGallery({
  artworks,
  content,
}: {
  artworks: Artwork[];
  content: HomepageContent;
}) {
  const [selected, setSelected] = useState<Artwork | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const featured = artworks.find((a) => a.featured) ?? artworks[0] ?? null;
  const pool = useMemo(
    () => artworks.filter((a) => a.id !== featured?.id),
    [artworks, featured?.id]
  );

  // Parallax on pointer — move the whole card, not its inner content.
  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-float-card]");

      const setters = cards.map((card, i) => ({
        x: gsap.quickTo(card, "x", { duration: 1.8, ease: "power2.out" }),
        y: gsap.quickTo(card, "y", { duration: 1.8, ease: "power2.out" }),
        depth: i % 3 === 0 ? 30 : i % 3 === 1 ? -22 : 18,
      }));

      function onPointer(e: PointerEvent) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const nx = (e.clientX - rect.left) / rect.width  - 0.5;
        const ny = (e.clientY - rect.top)  / rect.height - 0.5;
        setters.forEach((s) => {
          s.x(nx * s.depth);
          s.y(ny * s.depth);
        });
      }

      containerRef.current?.addEventListener("pointermove", onPointer);
      return () => containerRef.current?.removeEventListener("pointermove", onPointer);
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  if (!featured) return null;

  return (
    <section
      ref={containerRef}
      className="relative min-h-[calc(100vh-60px)] overflow-hidden bg-gallery-bg"
      aria-label="Featured digital art gallery"
    >
      {/* Ambient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(79,209,197,0.045)_0%,transparent_65%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/35 to-transparent" />

      {/* Hero text */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="pointer-events-none absolute left-5 top-8 z-20 max-w-[260px] md:left-10 md:top-12 lg:max-w-[310px]"
      >
        <h1 className="font-serif text-[clamp(34px,5vw,64px)] font-light leading-[0.98] tracking-normal text-gallery-ink">
          {content.heroTitle}
        </h1>
        <p className="mt-5 hidden max-w-sm text-[14px] font-light leading-7 text-[#9aa2ab] md:block">
          {content.heroSubtitle}
        </p>
      </motion.div>

      {/* CTA */}
      <Link
        href={content.heroCtaHref}
        className="btn btn-ghost absolute bottom-20 left-5 z-30 bg-gallery-bg/35 backdrop-blur md:bottom-[96px] md:left-10"
      >
        {content.heroCtaLabel}
        <ArrowRight size={14} />
      </Link>

      {/* Floating side cards — desktop only */}
      <div className="absolute inset-0 hidden md:block">
        {floatConfig.map((cfg, index) => {
          const artwork = pool[index % Math.max(pool.length, 1)];
          if (!artwork) return null;

          const { animate, transition } = getDriftAnimation(index);

          return (
            /*
             * The motion.button IS the card.
             * The image fills it with object-fit: cover (handled by ArtworkImage).
             * No child animation → no clipping artifacts, no scale, no ghost border.
             */
            <motion.button
              key={`${artwork.id}-${index}`}
              type="button"
              data-float-card
              onClick={() => setSelected(artwork)}
              className="absolute cursor-pointer overflow-hidden rounded-[3px] shadow-[0_8px_40px_rgba(0,0,0,0.55)] transition-shadow hover:z-50 hover:shadow-lift"
              style={{
                top:    cfg.top,
                left:   cfg.left,
                right:  cfg.right,
                width:  cfg.width,
                height: cfg.height,
                zIndex: cfg.z,
              }}
              animate={animate}
              transition={transition}
              whileHover={{ scale: 1 }} // explicit no-scale on hover
            >
              {/* Image fills the card completely */}
              <ArtworkImage artwork={artwork} sizes={`${cfg.width}px`} />

              {/* Subtle vignette — purely decorative overlay inside the card */}
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/55" />
            </motion.button>
          );
        })}
      </div>

      {/* Featured centre card */}
      <div className="absolute left-1/2 top-1/2 z-10 h-[min(600px,56vh)] w-[min(500px,82vw)] -translate-x-1/2 -translate-y-1/2 md:left-[60%] xl:left-1/2">
        <motion.button
          type="button"
          onClick={() => setSelected(featured)}
          className="relative h-full w-full cursor-pointer overflow-hidden rounded shadow-artwork outline-none transition focus-visible:ring-2 focus-visible:ring-gallery-accent"
          /*
           * Featured card: gentle side-to-side drift only.
           * No scale, no rotate, no y movement large enough to show gaps.
           */
          animate={{ x: [0, 8, 0, -8, 0], y: [0, -6, 4, -4, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArtworkImage artwork={featured} priority sizes="(min-width: 768px) 44vw, 82vw" />

          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-6 pb-6 pt-24 text-left">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-gallery-accent">
              {content.featuredSectionTitle}
            </span>
            <span className="mt-2 block font-serif text-[clamp(22px,3vw,32px)] font-light leading-tight tracking-normal text-gallery-ink">
              {featured.title}
            </span>
            <span className="mt-2 block font-mono text-[11px] uppercase tracking-[0.08em] text-gallery-muted">
              {featured.category}
            </span>
          </span>
        </motion.button>
      </div>

      {/* Filmstrip */}
      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/75 to-transparent px-4 pb-4 pt-16">
        <div className="filmstrip">
          {artworks.map((artwork) => (
            <button
              key={artwork.id}
              type="button"
              aria-label={`Open ${artwork.title}`}
              onClick={() => setSelected(artwork)}
              className="relative h-[58px] w-[76px] shrink-0 overflow-hidden rounded-[2px] border transition hover:-translate-y-1 hover:opacity-100"
              style={{
                opacity: artwork.featured ? 1 : 0.55,
                borderColor: artwork.featured
                  ? "rgba(79,209,197,0.55)"
                  : "rgba(255,255,255,0.06)",
              }}
            >
              <ArtworkImage artwork={artwork} sizes="76px" />
            </button>
          ))}
        </div>
      </div>

      <ArtworkModal
        artwork={selected}
        artworks={artworks}
        onClose={() => setSelected(null)}
        onSelect={setSelected}
      />
    </section>
  );
}