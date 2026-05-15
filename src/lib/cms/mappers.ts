import type {
  AboutContent,
  Artwork,
  Collection,
  ContactInfo,
  HomepageContent,
  Inquiry,
  SiteSettings,
  SocialLink
} from "@/types/cms";

type RecordLike = Record<string, unknown>;

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function mapArtwork(row: RecordLike): Artwork {
  const collection =
    row.collections && typeof row.collections === "object"
      ? (row.collections as RecordLike)
      : null;

  return {
    id: String(row.id),
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    category: String(row.category ?? collection?.title ?? "Uncategorized"),
    collectionId: row.collection_id ? String(row.collection_id) : null,
    collectionTitle: collection?.title ? String(collection.title) : null,
    collectionSlug: collection?.slug ? String(collection.slug) : null,
    tags: stringArray(row.tags),
    price: typeof row.price === "number" ? row.price : null,
    currency: String(row.currency ?? "USD"),
    dimensions: row.dimensions ? String(row.dimensions) : null,
    availability: (row.availability as Artwork["availability"]) ?? "available",
    buyLink: row.buy_link ? String(row.buy_link) : null,
    imageUrl: row.image_url ? String(row.image_url) : null,
    imagePublicId: row.image_public_id ? String(row.image_public_id) : null,
    thumbnailUrl: row.thumbnail_url ? String(row.thumbnail_url) : null,
    blurDataUrl: row.blur_data_url ? String(row.blur_data_url) : null,
    featured: Boolean(row.featured),
    homepageFeatured: Boolean(row.homepage_featured),
    published: row.published !== false,
    sortOrder: typeof row.sort_order === "number" ? row.sort_order : 0,
    gradientIndex: typeof row.gradient_index === "number" ? row.gradient_index : 0,
    seoTitle: row.seo_title ? String(row.seo_title) : null,
    seoDescription: row.seo_description ? String(row.seo_description) : null,
    createdAt: row.created_at ? String(row.created_at) : null,
    updatedAt: row.updated_at ? String(row.updated_at) : null
  };
}

export function mapCollection(row: RecordLike): Collection {
  return {
    id: String(row.id),
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    description: row.description ? String(row.description) : null,
    sortOrder: typeof row.sort_order === "number" ? row.sort_order : 0,
    featured: Boolean(row.featured),
    seoTitle: row.seo_title ? String(row.seo_title) : null,
    seoDescription: row.seo_description ? String(row.seo_description) : null
  };
}

export function mapHomepageContent(row: RecordLike | null, fallback: HomepageContent): HomepageContent {
  if (!row) {
    return fallback;
  }

  return {
    heroTitle: String(row.hero_title ?? fallback.heroTitle),
    heroSubtitle: String(row.hero_subtitle ?? fallback.heroSubtitle),
    heroCtaLabel: String(row.hero_cta_label ?? fallback.heroCtaLabel),
    heroCtaHref: String(row.hero_cta_href ?? fallback.heroCtaHref),
    featuredSectionTitle: String(row.featured_section_title ?? fallback.featuredSectionTitle),
    seoTitle: String(row.seo_title ?? fallback.seoTitle),
    seoDescription: String(row.seo_description ?? fallback.seoDescription)
  };
}

export function mapAboutContent(row: RecordLike | null, fallback: AboutContent): AboutContent {
  if (!row) {
    return fallback;
  }

  return {
    label: String(row.label ?? fallback.label),
    title: String(row.title ?? fallback.title),
    italicTitle: String(row.italic_title ?? fallback.italicTitle),
    body: String(row.body ?? fallback.body),
    secondaryBody: String(row.secondary_body ?? fallback.secondaryBody),
    metrics:
      Array.isArray(row.metrics) && row.metrics.length > 0
        ? (row.metrics as AboutContent["metrics"])
        : fallback.metrics,
    seoTitle: String(row.seo_title ?? fallback.seoTitle),
    seoDescription: String(row.seo_description ?? fallback.seoDescription)
  };
}

export function mapContactInfo(row: RecordLike | null, fallback: ContactInfo): ContactInfo {
  if (!row) {
    return fallback;
  }

  return {
    heading: String(row.heading ?? fallback.heading),
    italicHeading: String(row.italic_heading ?? fallback.italicHeading),
    email: String(row.email ?? fallback.email),
    location: String(row.location ?? fallback.location),
    instagram: String(row.instagram ?? fallback.instagram),
    phone: row.phone ? String(row.phone) : null,
    seoTitle: String(row.seo_title ?? fallback.seoTitle),
    seoDescription: String(row.seo_description ?? fallback.seoDescription)
  };
}

export function mapSiteSettings(row: RecordLike | null, fallback: SiteSettings): SiteSettings {
  if (!row) {
    return fallback;
  }

  return {
    siteName: String(row.site_name ?? fallback.siteName),
    logoText: String(row.logo_text ?? fallback.logoText),
    accentColor: String(row.accent_color ?? fallback.accentColor),
    defaultSeoTitle: String(row.default_seo_title ?? fallback.defaultSeoTitle),
    defaultSeoDescription: String(row.default_seo_description ?? fallback.defaultSeoDescription),
    ogImageUrl: row.og_image_url ? String(row.og_image_url) : null
  };
}

export function mapSocialLink(row: RecordLike): SocialLink {
  return {
    id: String(row.id),
    label: String(row.label ?? ""),
    url: String(row.url ?? ""),
    sortOrder: typeof row.sort_order === "number" ? row.sort_order : 0
  };
}

export function mapInquiry(row: RecordLike): Inquiry {
  const artwork =
    row.artworks && typeof row.artworks === "object" ? (row.artworks as RecordLike) : null;

  return {
    id: String(row.id),
    artworkId: row.artwork_id ? String(row.artwork_id) : null,
    artworkTitle: artwork?.title ? String(artwork.title) : null,
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    message: String(row.message ?? ""),
    budget: row.budget ? String(row.budget) : null,
    status: (row.status as Inquiry["status"]) ?? "new",
    createdAt: String(row.created_at ?? "")
  };
}
