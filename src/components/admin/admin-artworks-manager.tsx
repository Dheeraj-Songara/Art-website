"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, GripVertical, ImagePlus, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useTransition } from "react";
import { ArtworkImage } from "@/components/site/artwork-image";
import {
  deleteArtworkAction,
  reorderArtworksAction,
  saveArtworkAction,
  toggleArtworkFlagAction
} from "@/features/admin/actions";
import { slugify } from "@/lib/utils";
import type { Artwork, Collection } from "@/types/cms";

type UploadState = {
  imageUrl: string;
  imagePublicId: string;
  thumbnailUrl: string;
  images: string[];
};

const emptyUpload: UploadState = {
  imageUrl: "",
  imagePublicId: "",
  thumbnailUrl: "",
  images: []
};

const previewArtwork: Artwork = {
  id: "preview",
  slug: "preview",
  title: "Uploaded artwork",
  description: "",
  category: "Preview",
  collectionId: null,
  collectionTitle: null,
  collectionSlug: null,
  tags: [],
  price: null,
  currency: "USD",
  dimensions: null,
  availability: "available",
  buyLink: null,
  imageUrl: null,
  imagePublicId: null,
  thumbnailUrl: null,
  blurDataUrl: null,
  featured: false,
  homepageFeatured: false,
  published: true,
  sortOrder: 0,
  gradientIndex: 0,
  seoTitle: null,
  seoDescription: null,
  createdAt: null,
  updatedAt: null,
  images: []
};

function SortableArtworkRow({
  artwork,
  onEdit,
  onDelete,
  onToggle
}: {
  artwork: Artwork;
  onEdit: (artwork: Artwork) => void;
  onDelete: (artwork: Artwork) => void;
  onToggle: (artwork: Artwork, field: "featured" | "homepage_featured" | "published") => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: artwork.id
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`luxury-panel grid gap-4 p-3 md:grid-cols-[auto,96px,1fr,auto] md:items-center ${
        isDragging ? "border-gallery-accent/40 bg-gallery-accent/5" : ""
      }`}
    >
      <button
        type="button"
        aria-label={`Drag ${artwork.title}`}
        className="inline-flex h-9 w-9 items-center justify-center text-gallery-muted"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={17} />
      </button>
      <div className="relative h-20 overflow-hidden rounded-[3px]">
        <ArtworkImage artwork={artwork} sizes="96px" />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-serif text-xl font-light">{artwork.title}</h3>
          {artwork.featured ? <span className="tag text-[9px]">Featured</span> : null}
          {artwork.homepageFeatured ? <span className="tag text-[9px]">Home</span> : null}
          {!artwork.published ? <span className="tag border-red-300/20 bg-red-500/10 text-red-300">Draft</span> : null}
        </div>
        <p className="mt-1 truncate font-mono text-[11px] uppercase tracking-[0.08em] text-gallery-muted">
          {artwork.category} / {artwork.availability} / order {artwork.sortOrder}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onToggle(artwork, "featured")}
          className="btn btn-ghost px-3 py-2 text-[11px]"
        >
          <Star size={14} />
          Feature
        </button>
        <button
          type="button"
          onClick={() => onToggle(artwork, "homepage_featured")}
          className="btn btn-ghost px-3 py-2 text-[11px]"
        >
          <Check size={14} />
          Home
        </button>
        <button type="button" onClick={() => onEdit(artwork)} className="btn btn-ghost px-3 py-2 text-[11px]">
          <Pencil size={14} />
          Edit
        </button>
        <button type="button" onClick={() => onDelete(artwork)} className="btn btn-danger px-3 py-2 text-[11px]">
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}

export function AdminArtworksManager({
  initialArtworks,
  collections
}: {
  initialArtworks: Artwork[];
  collections: Collection[];
}) {
  const router = useRouter();
  const [artworks, setArtworks] = useState(initialArtworks);
  const [editing, setEditing] = useState<Artwork | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [upload, setUpload] = useState<UploadState>(emptyUpload);
  const [pending, startTransition] = useTransition();
  const [uploadingCount, setUploadingCount] = useState(0);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const categories = useMemo(
    () => Array.from(new Set(["Abstract", ...collections.map((item) => item.title), ...artworks.map((item) => item.category)])),
    [artworks, collections]
  );

  function beginCreate() {
    setEditing(null);
    setUpload(emptyUpload);
    setShowForm(true);
    setMessage("");
  }

  function beginEdit(artwork: Artwork) {
    setEditing(artwork);
    setUpload({
      imageUrl: artwork.imageUrl ?? "",
      imagePublicId: artwork.imagePublicId ?? "",
      thumbnailUrl: artwork.thumbnailUrl ?? "",
      // FIX: was missing images array
      images: artwork.images ?? []
    });
    setShowForm(true);
    setMessage("");
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    setArtworks((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const next = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
        ...item,
        sortOrder: index + 1
      }));

      startTransition(async () => {
        const result = await reorderArtworksAction(next.map((item) => item.id));
        setMessage(result.message);
        router.refresh();
      });

      return next;
    });
  }

  // FIX: Upload a single file and merge its result into state alongside any
  // previously uploaded images, rather than overwriting state with the wrong
  // variable (`artwork` which was undefined).
  async function handleUpload(file: File, isFirst: boolean) {
    const body = new FormData();
    body.set("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body
    });
    const result = (await response.json()) as UploadState & { ok: boolean; message?: string };

    if (!response.ok || !result.ok) {
      setMessage(result.message ?? "Upload failed.");
      return;
    }

    setUpload((prev) => {
      // The first uploaded file becomes the primary image; subsequent files
      // are appended to the `images` extras array.
      const newImages = result.imageUrl
        ? [...(prev.images ?? []), result.imageUrl]
        : prev.images ?? [];

      if (isFirst) {
        return {
          imageUrl: result.imageUrl,
          imagePublicId: result.imagePublicId,
          thumbnailUrl: result.thumbnailUrl,
          images: newImages
        };
      }

      return {
        ...prev,
        images: newImages
      };
    });
  }

  // FIX: Upload all selected files in parallel, tracking progress with a
  // counter so the message is accurate and state merges correctly.
  async function handleFiles(files: File[]) {
    if (files.length === 0) return;

    setUploadingCount(files.length);
    setMessage(`Uploading ${files.length} image${files.length > 1 ? "s" : ""} to Cloudinary…`);

    // Reset images list before a fresh batch so we don't double-append when
    // the user picks files a second time.
    setUpload((prev) => ({ ...prev, images: [] }));

    await Promise.all(files.map((file, index) => handleUpload(file, index === 0)));

    setUploadingCount(0);
    setMessage(`${files.length} image${files.length > 1 ? "s" : ""} uploaded and optimized.`);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (editing) {
      formData.set("id", editing.id);
    }
    if (!formData.get("slug")) {
      formData.set("slug", slugify(String(formData.get("title") ?? "")));
    }
    formData.set("imageUrl", upload.imageUrl);
    formData.set("imagePublicId", upload.imagePublicId);
    formData.set("thumbnailUrl", upload.thumbnailUrl);
    formData.set("images", JSON.stringify(upload.images));

    startTransition(async () => {
      const result = await saveArtworkAction(formData);
      setMessage(result.message);
      if (result.ok) {
        setShowForm(false);
        setEditing(null);
        router.refresh();
      }
    });
  }

  function handleDelete(artwork: Artwork) {
    if (!window.confirm(`Delete "${artwork.title}"?`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteArtworkAction(artwork.id);
      setMessage(result.message);
      if (result.ok) {
        setArtworks((items) => items.filter((item) => item.id !== artwork.id));
        router.refresh();
      }
    });
  }

  function handleToggle(
    artwork: Artwork,
    field: "featured" | "homepage_featured" | "published"
  ) {
    const current =
      field === "featured"
        ? artwork.featured
        : field === "homepage_featured"
          ? artwork.homepageFeatured
          : artwork.published;

    startTransition(async () => {
      const result = await toggleArtworkFlagAction(artwork.id, field, !current);
      setMessage(result.message);
      if (result.ok) {
        setArtworks((items) =>
          items.map((item) =>
            item.id === artwork.id
              ? {
                  ...item,
                  featured: field === "featured" ? !current : item.featured,
                  homepageFeatured: field === "homepage_featured" ? !current : item.homepageFeatured,
                  published: field === "published" ? !current : item.published
                }
              : item
          )
        );
        router.refresh();
      }
    });
  }

  // Remove a photo from the extras images list
  function removeExtraImage(url: string) {
    setUpload((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url)
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gallery-accent">
            Collection Manager
          </p>
          <h1 className="mt-2 font-serif text-4xl font-light">Artworks</h1>
          <p className="mt-2 text-sm text-gallery-muted">
            Upload, edit, delete, feature, publish, and drag to reorder the public gallery.
          </p>
        </div>
        <button type="button" onClick={beginCreate} className="btn btn-accent">
          <Plus size={15} />
          Add artwork
        </button>
      </div>

      {message ? (
        <div className="luxury-panel px-4 py-3 font-mono text-[12px] text-gallery-accent" role="status">
          {message}
        </div>
      ) : null}

      {showForm ? (
        <form onSubmit={handleSubmit} className="luxury-panel grid gap-7 p-5 xl:grid-cols-[0.8fr,1.2fr]">
          <div>
            <label className="admin-label">Artwork images</label>

            {/* Primary image picker */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden border-2 border-dashed border-white/10 bg-white/[0.02] transition hover:border-gallery-accent/40"
            >
              {upload.imageUrl || editing?.imageUrl ? (
                <ArtworkImage
                  artwork={{
                    ...(editing ?? artworks[0] ?? previewArtwork),
                    title: editing?.title ?? "Uploaded artwork",
                    imageUrl: upload.imageUrl || editing?.imageUrl || null,
                    thumbnailUrl: upload.thumbnailUrl || editing?.thumbnailUrl || null
                  }}
                  sizes="(min-width: 1280px) 34vw, 90vw"
                />
              ) : (
                <span className="flex flex-col items-center text-gallery-muted">
                  <ImagePlus size={32} className="mb-3 opacity-60" />
                  <span className="text-sm">Upload images</span>
                  <span className="mt-1 font-mono text-[11px]">Select one or more · Cloudinary f_auto / q_auto</span>
                </span>
              )}
            </button>

            {/* Hidden multi-file input */}
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []);
                if (files.length > 0) {
                  void handleFiles(files);
                }
                // Reset so the same files can be re-selected if needed
                event.target.value = "";
              }}
            />

            <input type="hidden" name="imageUrl" value={upload.imageUrl} />
            <input type="hidden" name="imagePublicId" value={upload.imagePublicId} />
            <input type="hidden" name="thumbnailUrl" value={upload.thumbnailUrl} />
            <input type="hidden" name="images" value={JSON.stringify(upload.images)} />

            {/* Extra images strip */}
            {upload.images.length > 0 ? (
              <div className="mt-3">
                <p className="admin-label mb-2">
                  All photos ({upload.images.length})
                  {uploadingCount > 0 ? (
                    <span className="ml-2 font-mono text-[10px] text-gallery-accent">uploading…</span>
                  ) : null}
                </p>
                <div className="flex flex-wrap gap-2">
                  {upload.images.map((url) => (
                    <div key={url} className="group relative h-16 w-16 overflow-hidden rounded-[3px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExtraImage(url)}
                        className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100"
                        aria-label="Remove photo"
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                      {url === upload.imageUrl ? (
                        <span className="absolute bottom-0 left-0 right-0 bg-gallery-accent/80 text-center font-mono text-[9px] leading-4 text-black">
                          Primary
                        </span>
                      ) : null}
                    </div>
                  ))}
                  {/* Add more button */}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex h-16 w-16 flex-col items-center justify-center rounded-[3px] border border-dashed border-white/10 text-gallery-muted transition hover:border-gallery-accent/40"
                  >
                    <Plus size={14} />
                    <span className="mt-0.5 font-mono text-[9px]">Add</span>
                  </button>
                </div>
              </div>
            ) : null}

            <div className="mt-4">
              <label className="admin-label" htmlFor="gradientIndex">
                Fallback gradient index
              </label>
              <input
                id="gradientIndex"
                name="gradientIndex"
                type="number"
                min={0}
                max={9}
                defaultValue={editing?.gradientIndex ?? artworks.length % 10}
                className="admin-input"
              />
            </div>
          </div>

          <div className="grid gap-4">
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
              <textarea
                id="description"
                name="description"
                rows={5}
                defaultValue={editing?.description}
                className="admin-input"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="admin-label" htmlFor="category">
                  Category
                </label>
                <select id="category" name="category" defaultValue={editing?.category} className="admin-input">
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="admin-label" htmlFor="collectionId">
                  Collection
                </label>
                <select
                  id="collectionId"
                  name="collectionId"
                  defaultValue={editing?.collectionId ?? ""}
                  className="admin-input"
                >
                  <option value="">None</option>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="admin-label" htmlFor="availability">
                  Availability
                </label>
                <select
                  id="availability"
                  name="availability"
                  defaultValue={editing?.availability ?? "available"}
                  className="admin-input"
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="admin-label" htmlFor="price">
                  Price
                </label>
                <input id="price" name="price" type="number" defaultValue={editing?.price ?? ""} className="admin-input" />
              </div>
              <div>
                <label className="admin-label" htmlFor="currency">
                  Currency
                </label>
                <input id="currency" name="currency" defaultValue={editing?.currency ?? "USD"} className="admin-input" />
              </div>
              <div>
                <label className="admin-label" htmlFor="dimensions">
                  Dimensions
                </label>
                <input id="dimensions" name="dimensions" defaultValue={editing?.dimensions ?? ""} className="admin-input" />
              </div>
              <div>
                <label className="admin-label" htmlFor="sortOrder">
                  Sort order
                </label>
                <input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  defaultValue={editing?.sortOrder ?? artworks.length + 1}
                  className="admin-input"
                />
              </div>
            </div>

            <div>
              <label className="admin-label" htmlFor="tags">
                Tags
              </label>
              <input
                id="tags"
                name="tags"
                defaultValue={editing?.tags.join(", ")}
                className="admin-input"
                placeholder="digital, generative, monochrome"
              />
            </div>

            <div>
              <label className="admin-label" htmlFor="buyLink">
                Buy link
              </label>
              <input id="buyLink" name="buyLink" defaultValue={editing?.buyLink ?? ""} className="admin-input" />
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
                <input
                  id="seoDescription"
                  name="seoDescription"
                  defaultValue={editing?.seoDescription ?? ""}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["featured", "Featured", editing?.featured ?? false],
                ["homepageFeatured", "Homepage featured", editing?.homepageFeatured ?? true],
                ["published", "Published", editing?.published ?? true]
              ].map(([name, label, checked]) => (
                <label key={String(name)} className="luxury-panel flex items-center gap-3 p-3 text-sm">
                  <input
                    type="checkbox"
                    name={String(name)}
                    defaultChecked={Boolean(checked)}
                    className="rounded border-gallery-line bg-white/[0.04] text-gallery-accent focus:ring-gallery-accent"
                  />
                  {label}
                </label>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="submit" className="btn btn-accent" disabled={pending || uploadingCount > 0}>
                {pending ? "Saving..." : uploadingCount > 0 ? `Uploading ${uploadingCount}…` : "Save artwork"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">
                Cancel
              </button>
            </div>
          </div>
        </form>
      ) : null}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={artworks.map((artwork) => artwork.id)} strategy={verticalListSortingStrategy}>
          <div className="grid gap-3">
            {artworks.map((artwork) => (
              <SortableArtworkRow
                key={artwork.id}
                artwork={artwork}
                onEdit={beginEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
