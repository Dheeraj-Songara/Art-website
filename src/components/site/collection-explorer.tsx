"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ArtworkCard } from "@/components/site/artwork-card";
import { cn } from "@/lib/utils";
import type { Artwork, Collection } from "@/types/cms";

const availabilityLabels = ["all", "available", "reserved", "sold"] as const;

export function CollectionExplorer({
  artworks,
  collections
}: {
  artworks: Artwork[];
  collections: Collection[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState<(typeof availabilityLabels)[number]>("all");

  const categories = useMemo(() => {
    const artworkCategories = artworks.map((artwork) => artwork.category);
    const collectionTitles = collections.map((collection) => collection.title);
    return ["All", ...Array.from(new Set([...collectionTitles, ...artworkCategories]))];
  }, [artworks, collections]);

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return artworks.filter((artwork) => {
      const matchesQuery =
        needle.length === 0 ||
        [artwork.title, artwork.description, artwork.category, ...artwork.tags]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      const matchesCategory = category === "All" || artwork.category === category;
      const matchesAvailability = availability === "all" || artwork.availability === availability;

      return matchesQuery && matchesCategory && matchesAvailability;
    });
  }, [artworks, availability, category, query]);

  return (
    <div>
      <div className="mb-9 grid gap-4 lg:grid-cols-[1fr,auto] lg:items-end">
        <div>
          <h1 className="font-serif text-[clamp(36px,6vw,70px)] font-light leading-none tracking-normal">
            Collections
          </h1>
          <p className="mt-3 text-[13px] text-gallery-muted">
            {shown.length} of {artworks.length} works across {categories.length - 1} categories
          </p>
        </div>
        <label className="relative block w-full max-w-md lg:w-[360px]">
          <span className="sr-only">Search artworks</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gallery-muted" size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="admin-input pl-9"
            placeholder="Search title, tag, or theme"
          />
        </label>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={cn(
              "border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition",
              category === item
                ? "border-gallery-accent/40 bg-gallery-accent/10 text-gallery-accent"
                : "border-gallery-line text-gallery-muted hover:border-white/20 hover:text-gallery-ink"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        {availabilityLabels.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setAvailability(item)}
            className={cn(
              "border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition",
              availability === item
                ? "border-white/25 text-gallery-ink"
                : "border-gallery-line text-gallery-muted hover:border-white/20 hover:text-gallery-ink"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {shown.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((artwork, index) => (
            <ArtworkCard key={artwork.id} artwork={artwork} index={index} />
          ))}
        </div>
      ) : (
        <div className="luxury-panel flex min-h-[260px] items-center justify-center p-8 text-center">
          <div>
            <p className="font-serif text-3xl font-light">No works match this view.</p>
            <p className="mt-2 text-sm text-gallery-muted">Adjust the filters or clear the search.</p>
          </div>
        </div>
      )}
    </div>
  );
}
