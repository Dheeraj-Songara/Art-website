import Link from "next/link";
import { getAdminArtworks, getInquiries } from "@/lib/cms/queries";

export default async function AdminOverviewPage() {
  const [artworks, inquiries] = await Promise.all([getAdminArtworks(), getInquiries()]);
  const available = artworks.filter((artwork) => artwork.availability === "available").length;
  const featured = artworks.filter((artwork) => artwork.featured).length;
  const drafts = artworks.filter((artwork) => !artwork.published).length;

  return (
    <main className="p-5 md:p-8">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gallery-accent">
          CMS Overview
        </p>
        <h1 className="mt-2 font-serif text-4xl font-light">Dashboard</h1>
        <p className="mt-2 text-sm text-gallery-muted">
          Manage gallery inventory, editorial content, acquisition inquiries, and SEO metadata.
        </p>
      </div>

      <section className="mt-8 grid gap-3 md:grid-cols-4">
        {[
          ["Artworks", artworks.length],
          ["Available", available],
          ["Featured", featured],
          ["Drafts", drafts]
        ].map(([label, value]) => (
          <div key={label} className="luxury-panel p-5">
            <div className="font-serif text-5xl font-light text-gallery-accent">{value}</div>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-gallery-muted">
              {label}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {[
          {
            href: "/admin/artworks",
            title: "Artworks",
            body: "Upload Cloudinary images, edit catalog metadata, toggle featured works, and drag to reorder."
          },
          {
            href: "/admin/content",
            title: "Site Content",
            body: "Control hero text, about page copy, contact information, social links, and SEO defaults."
          },
          {
            href: "/admin/inquiries",
            title: "Inquiries",
            body: `${inquiries.length} collector or contact messages waiting in the lightweight buy flow.`
          }
        ].map((item) => (
          <Link key={item.href} href={item.href} className="luxury-panel block p-5 transition hover:border-gallery-accent/35">
            <h2 className="font-serif text-2xl font-light">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-gallery-muted">{item.body}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
