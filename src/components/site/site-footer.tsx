import Link from "next/link";
import type { SiteSettings } from "@/types/cms";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="border-t border-gallery-line px-5 py-8 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 text-[12px] text-gallery-muted md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-serif text-lg tracking-[0.06em] text-gallery-ink">
            <LogoText value={settings.logoText} />
          </div>
          <p className="mt-1 max-w-md">{settings.defaultSeoDescription}</p>
        </div>
        <div className="flex flex-wrap gap-5 font-mono uppercase tracking-[0.1em]">
          <Link href="/collections" className="transition hover:text-gallery-ink">
            Collections
          </Link>
          <Link href="/contact" className="transition hover:text-gallery-ink">
            Inquiries
          </Link>
          <Link href="/admin" className="transition hover:text-gallery-accent">
            CMS
          </Link>
        </div>
      </div>
    </footer>
  );
}

function LogoText({ value }: { value: string }) {
  const [first, ...rest] = value.split(".");
  return (
    <>
      {first}
      <span className="text-gallery-accent">.</span>
      {rest.join(".")}
    </>
  );
}
