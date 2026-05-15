import Link from "next/link";

export function AdminEmptyConfig() {
  return (
    <main className="flex min-h-[calc(100vh-60px)] items-center justify-center px-5 py-16">
      <div className="luxury-panel max-w-xl p-8 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gallery-accent">
          CMS setup required
        </p>
        <h1 className="mt-4 font-serif text-4xl font-light">Connect Supabase to unlock admin.</h1>
        <p className="mt-4 text-sm leading-7 text-gallery-muted">
          The public site is running from seed data. Add the Supabase environment variables,
          apply the schema, create an admin user, and then sign in here.
        </p>
        <Link href="/admin/login" className="btn btn-ghost mt-7">
          View login
        </Link>
      </div>
    </main>
  );
}
