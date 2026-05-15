"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient, isSupabaseBrowserConfigured } from "@/lib/supabase/client";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(
    searchParams.get("error") === "not-admin" ? "Your account is not assigned to the admins table." : ""
  );
  const [pending, setPending] = useState(false);
  const configured = isSupabaseBrowserConfigured();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");

    try {
      if (!configured) {
        setMessage("Supabase is not configured yet.");
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setMessage(error.message);
        return;
      }

      router.push("/admin");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="luxury-panel w-full max-w-[400px] p-8">
      <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-gallery-accent">
        Admin Access
      </p>
      <h1 className="mb-7 font-serif text-3xl font-light">Sign in to the CMS</h1>

      <div className="grid gap-4">
        <div>
          <label className="admin-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="admin-input"
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="admin-input"
            autoComplete="current-password"
            required
          />
        </div>
        <button type="submit" className="btn btn-accent w-full" disabled={pending || !configured}>
          {pending ? "Signing in..." : "Access dashboard"}
        </button>
        {message ? (
          <p className="font-mono text-[12px] text-red-300" role="status">
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
