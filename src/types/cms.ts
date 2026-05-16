export type Availability = "available" | "reserved" | "sold" | "private";

export type Artwork = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  collectionId: string | null;
  collectionTitle: string | null;
  collectionSlug: string | null;
  tags: string[];
  price: number | null;
  currency: string;
  dimensions: string | null;
  availability: Availability;
  buyLink: string | null;
  imageUrl: string | null;
  images: string[] | null;
  imagePublicId: string | null;
  thumbnailUrl: string | null;
  blurDataUrl: string | null;
  featured: boolean;
  homepageFeatured: boolean;
  published: boolean;
  sortOrder: number;
  gradientIndex: number;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type Collection = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  sortOrder: number;
  featured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type HomepageContent = {
  heroTitle: string;
  heroSubtitle: string;
  heroCtaLabel: string;
  heroCtaHref: string;
  featuredSectionTitle: string;
  seoTitle: string;
  seoDescription: string;
};

export type AboutContent = {
  label: string;
  title: string;
  italicTitle: string;
  body: string;
  secondaryBody: string;
  metrics: Array<{ label: string; value: string }>;
  seoTitle: string;
  seoDescription: string;
};

export type ContactInfo = {
  heading: string;
  italicHeading: string;
  email: string;
  location: string;
  instagram: string;
  phone: string | null;
  seoTitle: string;
  seoDescription: string;
};

export type SocialLink = {
  id: string;
  label: string;
  url: string;
  sortOrder: number;
};

export type SiteSettings = {
  siteName: string;
  logoText: string;
  accentColor: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  ogImageUrl: string | null;
};

export type Inquiry = {
  id: string;
  artworkId: string | null;
  artworkTitle: string | null;
  name: string;
  email: string;
  message: string;
  budget: string | null;
  status: "new" | "contacted" | "closed";
  createdAt: string;
};
