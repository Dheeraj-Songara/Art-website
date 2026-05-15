import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { ArtworkImage } from "@/components/site/artwork-image";
import { InquiryForm } from "@/components/site/inquiry-form";
import { getArtworkBySlug, getPublishedArtworks } from "@/lib/cms/queries";
import { formatMoney } from "@/lib/utils";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const artworks = await getPublishedArtworks();
  return artworks.map((artwork) => ({ slug: artwork.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);

  if (!artwork) {
    return {};
  }

  return {
    title: artwork.seoTitle ?? artwork.title,
    description: artwork.seoDescription ?? artwork.description,
    openGraph: {
      title: artwork.seoTitle ?? artwork.title,
      description: artwork.seoDescription ?? artwork.description,
      images: artwork.imageUrl ? [{ url: artwork.imageUrl }] : []
    }
  };
}

export default async function ArtworkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);

  if (!artwork) {
    notFound();
  }

  return (
    <main className="min-h-[calc(100vh-60px)]">
      <section className="grid gap-10 px-5 py-12 md:px-10 lg:grid-cols-[minmax(340px,0.95fr),1fr] lg:py-16">
        <div className="relative min-h-[520px] overflow-hidden rounded shadow-[0_40px_100px_rgba(0,0,0,0.7)] lg:min-h-[720px]">
          <ArtworkImage artwork={artwork} priority sizes="(min-width: 1024px) 48vw, 100vw" />
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-5 flex flex-wrap gap-2">
            <span className="tag">{artwork.category}</span>
            {artwork.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag border-white/10 bg-white/[0.03] text-gallery-muted">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-serif text-[clamp(42px,7vw,86px)] font-light leading-[0.96] tracking-normal">
            {artwork.title}
          </h1>
          <p className="mt-7 max-w-2xl text-[16px] font-light leading-8 text-[#9aa2ab]">
            {artwork.description}
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-gallery-line py-7 md:grid-cols-4">
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
                Collection
              </dt>
              <dd className="mt-1 font-mono text-[13px] text-gallery-ink">
                {artwork.collectionTitle ?? artwork.category}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            {artwork.buyLink ? (
              <Link href={artwork.buyLink} className="btn btn-accent" target="_blank" rel="noreferrer">
                Buy work
                <ExternalLink size={14} />
              </Link>
            ) : (
              <Link href="#inquire" className="btn btn-accent">
                Inquire to buy
              </Link>
            )}
            <Link href="/collections" className="btn btn-ghost">
              Back to collections
            </Link>
          </div>
        </div>
      </section>

      <section id="inquire" className="border-t border-gallery-line px-5 py-12 md:px-10 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.7fr,1fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gallery-accent">
              Acquisition Inquiry
            </p>
            <h2 className="mt-4 font-serif text-[clamp(32px,5vw,54px)] font-light leading-tight">
              Request availability, pricing, and viewing details.
            </h2>
          </div>
          <div className="luxury-panel p-5 md:p-8">
            <InquiryForm artworkId={artwork.id} artworkTitle={artwork.title} />
          </div>
        </div>
      </section>
    </main>
  );
}
