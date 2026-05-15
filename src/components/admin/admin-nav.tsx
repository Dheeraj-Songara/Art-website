"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient, isSupabaseBrowserConfigured } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/artworks", label: "Artworks" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/inquiries", label: "Inquiries" }
];

export function AdminNav({ email }: { email: string | null }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    if (isSupabaseBrowserConfigured()) {
      await createSupabaseBrowserClient().auth.signOut();
    }
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="border-b border-gallery-line bg-white/[0.015] p-4 lg:min-h-[calc(100vh-60px)] lg:w-64 lg:border-b-0 lg:border-r">
      <div className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gallery-accent">
          Admin CMS
        </p>
        <p className="mt-2 truncate text-[12px] text-gallery-muted">{email}</p>
      </div>

      <nav className="flex flex-wrap gap-2 lg:flex-col">
        {adminLinks.map((link) => {
          const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition",
                active
                  ? "border-gallery-accent/40 bg-gallery-accent/10 text-gallery-accent"
                  : "border-gallery-line text-gallery-muted hover:border-white/20 hover:text-gallery-ink"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button type="button" onClick={signOut} className="btn btn-ghost mt-6 w-full justify-center">
        <LogOut size={14} />
        Sign out
      </button>
    </aside>
  );
}
