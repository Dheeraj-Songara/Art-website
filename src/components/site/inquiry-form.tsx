"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import {
  createInquiryAction,
  type InquiryActionState
} from "@/features/inquiries/actions";

const initialState: InquiryActionState = {
  ok: false,
  message: ""
};

export function InquiryForm({
  artworkId,
  artworkTitle
}: {
  artworkId?: string;
  artworkTitle?: string;
}) {
  const [state, formAction, pending] = useActionState(createInquiryAction, initialState);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-4">
      {artworkId ? <input type="hidden" name="artworkId" value={artworkId} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="admin-label" htmlFor="name">
            Name
          </label>
          <input id="name" name="name" required className="admin-input" placeholder="Your name" />
        </div>
        <div>
          <label className="admin-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="admin-input"
            placeholder="collector@example.com"
          />
        </div>
      </div>
      <div>
        <label className="admin-label" htmlFor="budget">
          Budget range
        </label>
        <input
          id="budget"
          name="budget"
          className="admin-input"
          placeholder="Optional"
          defaultValue={artworkTitle ? `Interested in ${artworkTitle}` : ""}
        />
      </div>
      <div>
        <label className="admin-label" htmlFor="message">
          Inquiry
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="admin-input"
          placeholder="Tell us about your acquisition timeline, framing needs, or private viewing request."
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn btn-accent" disabled={pending}>
          {pending ? "Sending..." : "Send inquiry"}
          <Send size={14} />
        </button>
        {state.message ? (
          <p
            className={`font-mono text-[12px] ${
              state.ok ? "text-gallery-accent" : "text-red-300"
            }`}
            role="status"
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
