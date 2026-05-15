"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  deleteCollectionAction,
  saveCollectionAction
} from "@/features/admin/actions";
import { slugify } from "@/lib/utils";
import type { Collection } from "@/types/cms";

export function AdminCollectionsManager({ collections }: { collections: Collection[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Collection | null>(null);
  const [showForm, setShowForm] = useState(collections.length === 0);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (editing) {
      formData.set("id", editing.id);
    }
    if (!formData.get("slug")) {
      formData.set("slug", slugify(String(formData.get("title") ?? "")));
    }

    startTransition(async () => {
      const result = await saveCollectionAction(formData);
      setMessage(result.message);
      if (result.ok) {
        setEditing(null);
        setShowForm(false);
        router.refresh();
      }
    });
  }

  function handleDelete(collection: Collection) {
    if (!window.confirm(`Delete "${collection.title}"? Artworks will keep their category text.`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteCollectionAction(collection.id);
      setMessage(result.message);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gallery-accent">
            Category CMS
          </p>
          <h1 className="mt-2 font-serif text-4xl font-light">Collections</h1>
          <p className="mt-2 text-sm text-gallery-muted">
            Manage collection landing metadata and category organization.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="btn btn-accent"
        >
          <Plus size={15} />
          Add collection
        </button>
      </div>

      {message ? (
        <div className="luxury-panel px-4 py-3 font-mono text-[12px] text-gallery-accent" role="status">
          {message}
        </div>
      ) : null}

      {showForm ? (
        <form onSubmit={handleSubmit} className="luxury-panel grid gap-4 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="admin-label" htmlFor="title">
                Title
              </label>
              <input id="title" name="title" required defaultValue={editing?.title} className="admin-input" />
            </div>
            <div>
              <label className="admin-label" htmlFor="slug">
                Slug
              </label>
              <input id="slug" name="slug" defaultValue={editing?.slug} className="admin-input" />
            </div>
          </div>
          <div>
            <label className="admin-label" htmlFor="description">
              Description
            </label>
            <textarea id="description" name="description" rows={4} defaultValue={editing?.description ?? ""} className="admin-input" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="admin-label" htmlFor="sortOrder">
                Sort order
              </label>
              <input id="sortOrder" name="sortOrder" type="number" defaultValue={editing?.sortOrder ?? collections.length + 1} className="admin-input" />
            </div>
            <label className="luxury-panel mt-5 flex items-center gap-3 p-3 text-sm md:mt-0 md:self-end">
              <input
                name="featured"
                type="checkbox"
                defaultChecked={editing?.featured ?? true}
                className="rounded border-gallery-line bg-white/[0.04] text-gallery-accent focus:ring-gallery-accent"
              />
              Featured collection
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="admin-label" htmlFor="seoTitle">
                SEO title
              </label>
              <input id="seoTitle" name="seoTitle" defaultValue={editing?.seoTitle ?? ""} className="admin-input" />
            </div>
            <div>
              <label className="admin-label" htmlFor="seoDescription">
                SEO description
              </label>
              <input id="seoDescription" name="seoDescription" defaultValue={editing?.seoDescription ?? ""} className="admin-input" />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn btn-accent" disabled={pending}>
              {pending ? "Saving..." : "Save collection"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="grid gap-3">
        {collections.map((collection) => (
          <div key={collection.id} className="luxury-panel grid gap-4 p-4 md:grid-cols-[1fr,auto] md:items-center">
            <div>
              <h2 className="font-serif text-2xl font-light">{collection.title}</h2>
              <p className="mt-1 text-sm text-gallery-muted">{collection.description}</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-gallery-muted">
                /{collection.slug} / order {collection.sortOrder}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-ghost px-3 py-2 text-[11px]"
                onClick={() => {
                  setEditing(collection);
                  setShowForm(true);
                }}
              >
                <Pencil size={14} />
                Edit
              </button>
              <button
                type="button"
                className="btn btn-danger px-3 py-2 text-[11px]"
                onClick={() => handleDelete(collection)}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
