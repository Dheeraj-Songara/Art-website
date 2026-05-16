import type {
  AboutContent,
  Artwork,
  Collection,
  ContactInfo,
  HomepageContent,
  SiteSettings,
  SocialLink
} from "@/types/cms";

export const artGradients = [
  { bg: "linear-gradient(140deg,#061520 0%,#0d3b5e 35%,#1a7a8a 65%,#2dd4bf 100%)", hi: "#2dd4bf" },
  { bg: "linear-gradient(155deg,#0f0c29 0%,#302b63 50%,#24243e 100%)", hi: "#a78bfa" },
  { bg: "linear-gradient(140deg,#1a0533 0%,#6b21a8 50%,#db2777 100%)", hi: "#f472b6" },
  { bg: "linear-gradient(140deg,#0f2027 0%,#203a43 50%,#2c5364 100%)", hi: "#67e8f9" },
  { bg: "linear-gradient(160deg,#0a0a0a 0%,#1a1a2e 40%,#0f3460 100%)", hi: "#e94560" },
  { bg: "linear-gradient(140deg,#1b4332 0%,#2d6a4f 50%,#52b788 100%)", hi: "#6ee7b7" },
  { bg: "linear-gradient(140deg,#3d0000 0%,#7f1d1d 50%,#dc2626 100%)", hi: "#fca5a5" },
  { bg: "linear-gradient(140deg,#2d1b00 0%,#92400e 50%,#d97706 100%)", hi: "#fcd34d" },
  { bg: "linear-gradient(155deg,#0d1b2a 0%,#1b263b 40%,#415a77 100%)", hi: "#93c5fd" },
  { bg: "linear-gradient(140deg,#1e1b4b 0%,#312e81 50%,#4f46e5 100%)", hi: "#a5b4fc" }
];

export const fallbackCollections: Collection[] = [
  {
    id: "fluid-dynamics",
    slug: "fluid-dynamics",
    title: "Fluid Dynamics",
    description: "Algorithmic turbulence, neural current, and deep-water motion studies.",
    sortOrder: 1,
    featured: true,
    seoTitle: "Fluid Dynamics Digital Art Collection",
    seoDescription: "Luxury digital works exploring turbulence, water, and generative motion."
  },
  {
    id: "chromatic",
    slug: "chromatic",
    title: "Chromatic",
    description: "Color as conflict, signal, warning, and desire.",
    sortOrder: 2,
    featured: true,
    seoTitle: "Chromatic Digital Art Collection",
    seoDescription: "Premium chromatic digital works and abstract color studies."
  },
  {
    id: "abstract",
    slug: "abstract",
    title: "Abstract",
    description: "Entropy, frequency, atmosphere, and computational memory.",
    sortOrder: 3,
    featured: true,
    seoTitle: "Abstract Digital Art Collection",
    seoDescription: "Cinematic abstract works for contemporary collectors."
  }
];

const baseArtwork = {
  collectionId: null,
  collectionTitle: null,
  collectionSlug: null,
  tags: ["digital", "generative"],
  currency: "USD",
  imageUrl: null,
  imagePublicId: null,
  thumbnailUrl: null,
  blurDataUrl: null,
  published: true,
  seoTitle: null,
  seoDescription: null,
  createdAt: null,
  updatedAt: null,
  images: []
};

export const fallbackArtworks: Artwork[] = [
  {
    ...baseArtwork,
    id: "1",
    slug: "void-currents-i",
    title: "Void Currents I",
    description:
      "Deep oceanic turbulence captured through algorithmic fluid simulation. Each wave represents data flowing through neural pathways of a dormant consciousness.",
    category: "Fluid Dynamics",
    collectionId: "fluid-dynamics",
    collectionTitle: "Fluid Dynamics",
    collectionSlug: "fluid-dynamics",
    tags: ["fluid", "algorithmic", "oceanic"],
    price: 8200,
    dimensions: "48 x 60 in",
    availability: "available",
    buyLink: null,
    featured: true,
    homepageFeatured: true,
    sortOrder: 1,
    gradientIndex: 0
  },
  {
    ...baseArtwork,
    id: "2",
    slug: "nocturne-collapse",
    title: "Nocturne Collapse",
    description:
      "A meditation on entropy: the systematic unraveling of ordered systems into beautiful chaos. Shot during the darkest hour before dawn.",
    category: "Abstract",
    collectionId: "abstract",
    collectionTitle: "Abstract",
    collectionSlug: "abstract",
    tags: ["entropy", "night", "chaos"],
    price: 6400,
    dimensions: "40 x 52 in",
    availability: "available",
    buyLink: null,
    featured: false,
    homepageFeatured: true,
    sortOrder: 2,
    gradientIndex: 1
  },
  {
    ...baseArtwork,
    id: "3",
    slug: "chromatic-tension",
    title: "Chromatic Tension",
    description:
      "Color as conflict. The violent meeting of warm and cold spectra, frozen at the moment of maximum contrast between desire and restraint.",
    category: "Chromatic",
    collectionId: "chromatic",
    collectionTitle: "Chromatic",
    collectionSlug: "chromatic",
    tags: ["color", "spectrum", "contrast"],
    price: 7300,
    dimensions: "44 x 58 in",
    availability: "reserved",
    buyLink: null,
    featured: false,
    homepageFeatured: true,
    sortOrder: 3,
    gradientIndex: 2
  },
  {
    ...baseArtwork,
    id: "4",
    slug: "depth-sounding",
    title: "Depth Sounding",
    description:
      "Mapping the invisible layers beneath perception. What lies below the surface of awareness, under the still water of the mind?",
    category: "Fluid Dynamics",
    collectionId: "fluid-dynamics",
    collectionTitle: "Fluid Dynamics",
    collectionSlug: "fluid-dynamics",
    tags: ["depth", "perception", "water"],
    price: 5900,
    dimensions: "36 x 50 in",
    availability: "available",
    buyLink: null,
    featured: false,
    homepageFeatured: true,
    sortOrder: 4,
    gradientIndex: 3
  },
  {
    ...baseArtwork,
    id: "5",
    slug: "signal-noise",
    title: "Signal / Noise",
    description:
      "The perpetual human struggle to extract meaning from the overwhelming background hum of a world drowning in its own data.",
    category: "Digital",
    tags: ["signal", "data", "computation"],
    price: 6800,
    dimensions: "42 x 48 in",
    availability: "available",
    buyLink: null,
    featured: false,
    homepageFeatured: true,
    sortOrder: 5,
    gradientIndex: 4
  },
  {
    ...baseArtwork,
    id: "6",
    slug: "verdant-memory",
    title: "Verdant Memory",
    description:
      "Organic growth patterns crystallized in time. Nature's deep algorithm made visible through the lens of meditative observation.",
    category: "Organic",
    tags: ["organic", "growth", "memory"],
    price: 5700,
    dimensions: "38 x 44 in",
    availability: "available",
    buyLink: null,
    featured: false,
    homepageFeatured: true,
    sortOrder: 6,
    gradientIndex: 5
  },
  {
    ...baseArtwork,
    id: "7",
    slug: "scarlet-protocol",
    title: "Scarlet Protocol",
    description:
      "Warning systems and desire share the same frequency. An exploration of red as a language older than speech.",
    category: "Chromatic",
    collectionId: "chromatic",
    collectionTitle: "Chromatic",
    collectionSlug: "chromatic",
    tags: ["red", "protocol", "signal"],
    price: 7600,
    dimensions: "48 x 48 in",
    availability: "sold",
    buyLink: null,
    featured: false,
    homepageFeatured: true,
    sortOrder: 7,
    gradientIndex: 6
  },
  {
    ...baseArtwork,
    id: "8",
    slug: "gilded-frequency",
    title: "Gilded Frequency",
    description:
      "Resonance captured in amber. The golden ratio made audible, then rendered visible through pure chromatic expression.",
    category: "Abstract",
    collectionId: "abstract",
    collectionTitle: "Abstract",
    collectionSlug: "abstract",
    tags: ["gold", "frequency", "resonance"],
    price: 9100,
    dimensions: "50 x 62 in",
    availability: "available",
    buyLink: null,
    featured: false,
    homepageFeatured: true,
    sortOrder: 8,
    gradientIndex: 7
  },
  {
    ...baseArtwork,
    id: "9",
    slug: "atmospheric-drift",
    title: "Atmospheric Drift",
    description:
      "Suspended between states. Neither solid nor liquid, the work exists in perpetual transition, like consciousness before sleep.",
    category: "Atmospheric",
    tags: ["atmosphere", "transition", "sleep"],
    price: 6200,
    dimensions: "36 x 54 in",
    availability: "available",
    buyLink: null,
    featured: false,
    homepageFeatured: true,
    sortOrder: 9,
    gradientIndex: 8
  },
  {
    ...baseArtwork,
    id: "10",
    slug: "indigo-protocol",
    title: "Indigo Protocol",
    description:
      "A study in depth and distance. Layers of blue-violet compress and expand, creating impossible spaces the eye wants to enter.",
    category: "Geometric",
    tags: ["indigo", "geometry", "depth"],
    price: 7000,
    dimensions: "40 x 60 in",
    availability: "available",
    buyLink: null,
    featured: false,
    homepageFeatured: true,
    sortOrder: 10,
    gradientIndex: 9
  }
];

export const fallbackHomepage: HomepageContent = {
  heroTitle: "Where digital consciousness becomes visible",
  heroSubtitle:
    "A cinematic collection of generative works curated for collectors who want art that reveals more the longer it is inhabited.",
  heroCtaLabel: "Explore collections",
  heroCtaHref: "/collections",
  featuredSectionTitle: "Featured Work",
  seoTitle: "VOID.GALLERY | Luxury Digital Art Gallery",
  seoDescription:
    "A cinematic luxury digital art gallery featuring collectible generative artworks, editorial collections, and private acquisition inquiries."
};

export const fallbackAbout: AboutContent = {
  label: "About the Gallery",
  title: "Where digital consciousness",
  italicTitle: "becomes visible",
  body:
    "This gallery exists at the intersection of algorithmic generation and human curation. Each work represents a moment where machine intelligence and artistic intention converge into something neither could produce alone.",
  secondaryBody:
    "We collect and exhibit digital art exploring themes of consciousness, data, emergence, and the aesthetics of computation. Our focus is on works that reward sustained attention: pieces that reveal more the longer you inhabit them.",
  metrics: [
    { label: "Digital Works", value: "150+" },
    { label: "Artists Represented", value: "23" },
    { label: "Collections", value: "8" }
  ],
  seoTitle: "About VOID.GALLERY",
  seoDescription: "Learn about the curatorial point of view behind VOID.GALLERY."
};

export const fallbackContact: ContactInfo = {
  heading: "Let's talk about",
  italicHeading: "your vision",
  email: "hello@gallery.art",
  location: "Online and private advisory by appointment",
  instagram: "@void.gallery",
  phone: null,
  seoTitle: "Contact VOID.GALLERY",
  seoDescription: "Contact VOID.GALLERY for acquisition inquiries, private viewings, and artist representation."
};

export const fallbackSocialLinks: SocialLink[] = [
  { id: "instagram", label: "Instagram", url: "https://instagram.com/void.gallery", sortOrder: 1 },
  { id: "email", label: "Email", url: "mailto:hello@gallery.art", sortOrder: 2 }
];

export const fallbackSiteSettings: SiteSettings = {
  siteName: "VOID.GALLERY",
  logoText: "VOID.GALLERY",
  accentColor: "#4fd1c5",
  defaultSeoTitle: "VOID.GALLERY | Luxury Digital Art Gallery",
  defaultSeoDescription:
    "Cinematic digital art collections with private acquisition inquiries and a curator-managed catalog.",
  ogImageUrl: null
};
