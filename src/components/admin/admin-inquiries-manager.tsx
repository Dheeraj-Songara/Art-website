"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateInquiryStatusAction } from "@/features/admin/actions";
import type { Inquiry } from "@/types/cms";

export function AdminInquiriesManager({ inquiries }: { inquiries: Inquiry[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function updateStatus(id: string, status: Inquiry["status"]) {
    startTransition(async () => {
      const result = await updateInquiryStatusAction(id, status);
      setMessage(result.message);
      if (result.ok) {
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gallery-accent">
          Collector Requests
        </p>
        <h1 className="mt-2 font-serif text-4xl font-light">Inquiries</h1>
        <p className="mt-2 text-sm text-gallery-muted">
          Lightweight buy flow for artwork acquisition and general contact messages.
        </p>
      </div>

      {message ? (
        <div className="luxury-panel px-4 py-3 font-mono text-[12px] text-gallery-accent" role="status">
          {message}
        </div>
      ) : null}

      <div className="grid gap-3">
        {inquiries.length > 0 ? (
          inquiries.map((inquiry) => (
            <article key={inquiry.id} className="luxury-panel p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-light">{inquiry.name}</h2>
                  <p className="mt-1 text-sm text-gallery-muted">
                    {inquiry.email} / {inquiry.artworkTitle ?? "General inquiry"}
                  </p>
                </div>
                <select
                  value={inquiry.status}
                  disabled={pending}
                  onChange={(event) => updateStatus(inquiry.id, event.target.value as Inquiry["status"])}
                  className="admin-input w-fit min-w-36"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#9aa2ab]">{inquiry.message}</p>
              {inquiry.budget ? (
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-gallery-accent">
                  Budget / {inquiry.budget}
                </p>
              ) : null}
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-gallery-muted">
                {new Date(inquiry.createdAt).toLocaleString()}
              </p>
            </article>
          ))
        ) : (
          <div className="luxury-panel p-8 text-center text-gallery-muted">
            No inquiries yet.
          </div>
        )}
      </div>
    </div>
  );
}
