import type { Metadata } from "next";
import { InquiryForm } from "@/components/site/inquiry-form";
import { getContactInfo, getSocialLinks } from "@/lib/cms/queries";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getContactInfo();

  return {
    title: contact.seoTitle,
    description: contact.seoDescription
  };
}

export default async function ContactPage() {
  const [contact, socialLinks] = await Promise.all([getContactInfo(), getSocialLinks()]);

  return (
    <main className="flex min-h-[calc(100vh-60px)] items-center justify-center px-5 py-16 md:px-10">
      <section className="grid w-full max-w-6xl gap-12 lg:grid-cols-[0.85fr,1.15fr] lg:items-start">
        <div>
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-gallery-accent">
            Get in Touch
          </p>
          <h1 className="font-serif text-[clamp(38px,6vw,66px)] font-light leading-[1.05] tracking-normal">
            {contact.heading}
            <br />
            <em className="text-gallery-muted">{contact.italicHeading}</em>
          </h1>

          <dl className="mt-10 grid gap-6 border-t border-gallery-line pt-8 sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-gallery-muted">
                Email
              </dt>
              <dd className="mt-1 text-[13px] text-[#9aa2ab]">{contact.email}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-gallery-muted">
                Location
              </dt>
              <dd className="mt-1 text-[13px] text-[#9aa2ab]">{contact.location}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-gallery-muted">
                Instagram
              </dt>
              <dd className="mt-1 text-[13px] text-[#9aa2ab]">{contact.instagram}</dd>
            </div>
            {contact.phone ? (
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-gallery-muted">
                  Phone
                </dt>
                <dd className="mt-1 text-[13px] text-[#9aa2ab]">{contact.phone}</dd>
              </div>
            ) : null}
          </dl>

          {socialLinks.length > 0 ? (
            <div className="mt-7 flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-[0.1em] text-gallery-muted">
              {socialLinks.map((link) => (
                <a key={link.id} href={link.url} className="transition hover:text-gallery-ink">
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div className="luxury-panel p-5 md:p-8">
          <InquiryForm />
        </div>
      </section>
    </main>
  );
}
