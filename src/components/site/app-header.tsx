"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Gallery" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function AppHeader({ logoText }: { logoText: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gallery-line bg-gallery-bg/90 px-4 backdrop-blur-2xl md:px-6">
      <nav className="flex h-[60px] items-center">
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className="mr-4 inline-flex h-9 w-9 items-center justify-center text-gallery-muted transition hover:text-gallery-ink lg:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        <Link
          href="/"
          className="mr-auto font-serif text-[18px] font-normal tracking-[0.06em] text-gallery-ink"
          onClick={() => setOpen(false)}
        >
          <LogoText value={logoText} />
        </Link>

        <div className="mr-6 hidden items-center gap-7 lg:flex">
          {links.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn("nav-link", active && "nav-link-active")}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <Link
          href="/admin"
          className={cn(
            "font-mono text-[10px] uppercase tracking-[0.15em] text-[#4a5158] transition hover:text-gallery-accent",
            pathname?.startsWith("/admin") && "text-gallery-accent"
          )}
        >
          Admin
        </Link>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 top-[60px] z-40 flex min-h-[calc(100vh-60px)] flex-col items-center justify-center gap-8 bg-gallery-bg/95 backdrop-blur-2xl lg:hidden"
            onClick={() => setOpen(false)}
          >
            {links.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-serif text-4xl font-light tracking-[0.04em] text-gallery-ink transition",
                    active && "text-gallery-accent"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gallery-muted">
              Private digital collection
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
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
