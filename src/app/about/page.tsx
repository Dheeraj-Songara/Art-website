import type { Metadata } from "next";
import { ArtworkImage } from "@/components/site/artwork-image";
import { fallbackArtworks } from "@/lib/cms/fallback-data";
import { getAboutContent, getPublishedArtworks } from "@/lib/cms/queries";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getAboutContent();

  return {
    title: content.seoTitle,
    description: content.seoDescription
  };
}

export default async function AboutPage() {
  const [content, artworks] = await Promise.all([getAboutContent(), getPublishedArtworks()]);
  const visual = artworks[0] ?? fallbackArtworks[0];

  return (
    <main className="min-h-[calc(100vh-60px)]">
      <section className="grid min-h-[70vh] border-b border-gallery-line lg:grid-cols-2">
        <div className="flex flex-col justify-center border-gallery-line px-5 py-16 md:px-14 lg:border-r lg:px-16">
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.18em] text-gallery-accent">
            {content.label}
          </p>
          <h1 className="font-serif text-[clamp(40px,6vw,76px)] font-light leading-[1.02] tracking-normal">
            {content.title}
            <br />
            <em className="text-gallery-muted">{content.italicTitle}</em>
          </h1>
          <p className="mt-8 max-w-xl text-[15px] font-light leading-8 text-[#9aa2ab]">
            {content.body}
          </p>
          <p className="mt-6 max-w-xl text-[14px] font-light leading-8 text-gallery-muted">
            {content.secondaryBody}
          </p>
        </div>
        <div className="relative min-h-[420px] overflow-hidden">
          <ArtworkImage artwork={visual} priority sizes="(min-width: 1024px) 50vw, 100vw" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gallery-bg/70" />
          <div className="absolute bottom-10 left-10 font-serif text-7xl font-light leading-none text-white/15">
            ∞
          </div>
        </div>
      </section>

      <section className="grid gap-8 px-5 py-14 md:grid-cols-3 md:px-14 lg:px-16">
        {content.metrics.map((metric) => (
          <div key={metric.label}>
            <div className="font-serif text-5xl font-light text-gallery-accent">{metric.value}</div>
            <div className="mt-2 font-mono text-[12px] uppercase tracking-[0.1em] text-gallery-muted">
              {metric.label}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
