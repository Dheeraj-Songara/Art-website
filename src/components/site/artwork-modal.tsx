"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import { useEffect } from "react";
import { ArtworkImage } from "@/components/site/artwork-image";
import { formatMoney } from "@/lib/utils";
import type { Artwork } from "@/types/cms";

type ArtworkModalProps = {
  artwork: Artwork | null;
  artworks: Artwork[];
  onClose: () => void;
  onSelect: (artwork: Artwork) => void;
};

export function ArtworkModal({ artwork, artworks, onClose, onSelect }: ArtworkModalProps) {
  const index = artwork ? artworks.findIndex((item) => item.id === artwork.id) : -1;
  const previous = index > 0 ? artworks[index - 1] : null;
  const next = index >= 0 && index < artworks.length - 1 ? artworks[index + 1] : null;

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowLeft" && previous) {
        onSelect(previous);
      }
      if (event.key === "ArrowRight" && next) {
        onSelect(next);
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [next, onClose, onSelect, previous]);

  return (
    <AnimatePresence>
      {artwork ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${artwork.title} artwork details`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05080c]/95 px-5 py-16 backdrop-blur-xl"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <button
            type="button"
            aria-label="Close artwork details"
            onClick={onClose}
            className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gallery-line bg-white/[0.07] text-gallery-muted transition hover:bg-white/[0.12] hover:text-gallery-ink"
          >
            <X size={18} />
          </button>

          {previous ? (
            <button
              type="button"
              aria-label="Previous artwork"
              onClick={() => onSelect(previous)}
              className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gallery-line bg-white/[0.06] text-gallery-muted transition hover:bg-white/10 hover:text-gallery-ink md:inline-flex"
            >
              <ChevronLeft size={20} />
            </button>
          ) : null}

          {next ? (
            <button
              type="button"
              aria-label="Next artwork"
              onClick={() => onSelect(next)}
              className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gallery-line bg-white/[0.06] text-gallery-muted transition hover:bg-white/10 hover:text-gallery-ink md:inline-flex"
            >
              <ChevronRight size={20} />
            </button>
          ) : null}

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ type: "spring", stiffness: 180, damping: 24 }}
            className="grid w-full max-w-6xl items-center gap-8 md:grid-cols-[minmax(300px,520px),1fr] md:gap-10"
          >
            <div className="relative h-[54vh] min-h-[330px] overflow-hidden rounded shadow-[0_40px_100px_rgba(0,0,0,0.7)] md:h-[min(620px,62vh)]">
              <ArtworkImage artwork={artwork} priority sizes="(min-width: 1024px) 42vw, 90vw" />
            </div>

            <div className="min-w-0">
              <span className="tag mb-5">{artwork.category}</span>
              <h2 className="max-w-2xl font-serif text-[clamp(32px,5vw,56px)] font-light leading-[1.02] tracking-normal text-gallery-ink">
                {artwork.title}
              </h2>
              <p className="mt-5 max-w-xl text-[15px] font-light leading-8 text-[#9aa2ab]">
                {artwork.description}
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-5 border-t border-gallery-line pt-6 sm:grid-cols-4">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-gallery-muted">
                    Price
                  </dt>
                  <dd className="mt-1 font-mono text-[13px] text-gallery-accent">
                    {formatMoney(artwork.price, artwork.currency)}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-gallery-muted">
                    Dimensions
                  </dt>
                  <dd className="mt-1 font-mono text-[13px] text-gallery-ink">
                    {artwork.dimensions ?? "Variable"}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-gallery-muted">
                    Status
                  </dt>
                  <dd className="mt-1 font-mono text-[13px] capitalize text-gallery-ink">
                    {artwork.availability}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-gallery-muted">
                    Work ID
                  </dt>
                  <dd className="mt-1 font-mono text-[13px] text-gallery-accent">
                    #{artwork.id.slice(0, 8).toUpperCase()}
                  </dd>
                </div>
              </dl>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={`/artworks/${artwork.slug}`} className="btn btn-accent" onClick={onClose}>
                  View details
                </Link>
                {artwork.buyLink ? (
                  <Link href={artwork.buyLink} className="btn btn-ghost" target="_blank" rel="noreferrer">
                    Buy work
                    <ExternalLink size={14} />
                  </Link>
                ) : (
                  <Link href={`/artworks/${artwork.slug}#inquire`} className="btn btn-ghost" onClick={onClose}>
                    Inquire to buy
                  </Link>
                )}
              </div>
            </div>
          </motion.div>

          <div className="filmstrip absolute inset-x-0 bottom-4 px-5 md:px-20">
            {artworks.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Preview ${item.title}`}
                onClick={() => onSelect(item)}
                className="relative h-[52px] w-[70px] shrink-0 overflow-hidden rounded-[2px] border transition"
                style={{
                  opacity: item.id === artwork.id ? 1 : 0.42,
                  borderColor:
                    item.id === artwork.id ? "rgba(79,209,197,0.6)" : "rgba(255,255,255,0)"
                }}
              >
                <ArtworkImage artwork={item} sizes="70px" />
              </button>
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
