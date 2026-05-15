import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import {
  fallbackAbout,
  fallbackArtworks,
  fallbackCollections,
  fallbackContact,
  fallbackHomepage,
  fallbackSiteSettings,
  fallbackSocialLinks
} from "@/lib/cms/fallback-data";
import {
  mapAboutContent,
  mapArtwork,
  mapCollection,
  mapContactInfo,
  mapHomepageContent,
  mapInquiry,
  mapSiteSettings,
  mapSocialLink
} from "@/lib/cms/mappers";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
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

const artworkSelect = `
  *,
  collections (
    title,
    slug
  )
`;

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) {
    return fallbackSiteSettings;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("site_settings").select("*").single();

  if (error) {
    return fallbackSiteSettings;
  }

  return mapSiteSettings(data, fallbackSiteSettings);
}

export async function getHomepageContent(): Promise<HomepageContent> {
  if (!isSupabaseConfigured()) {
    return fallbackHomepage;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("homepage_content").select("*").single();

  if (error) {
    return fallbackHomepage;
  }

  return mapHomepageContent(data, fallbackHomepage);
}

export async function getAboutContent(): Promise<AboutContent> {
  if (!isSupabaseConfigured()) {
    return fallbackAbout;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("about_content").select("*").single();

  if (error) {
    return fallbackAbout;
  }

  return mapAboutContent(data, fallbackAbout);
}

export async function getContactInfo(): Promise<ContactInfo> {
  if (!isSupabaseConfigured()) {
    return fallbackContact;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("contact_info").select("*").single();

  if (error) {
    return fallbackContact;
  }

  return mapContactInfo(data, fallbackContact);
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  if (!isSupabaseConfigured()) {
    return fallbackSocialLinks;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("social_links").select("*").order("sort_order");

  if (error || !data) {
    return fallbackSocialLinks;
  }

  return data.map(mapSocialLink);
}

export async function getCollections(): Promise<Collection[]> {
  if (!isSupabaseConfigured()) {
    return fallbackCollections;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("collections").select("*").order("sort_order");

  if (error || !data) {
    return fallbackCollections;
  }

  return data.map(mapCollection);
}

export async function getPublishedArtworks(): Promise<Artwork[]> {
  if (!isSupabaseConfigured()) {
    return fallbackArtworks;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("artworks")
    .select(artworkSelect)
    .eq("published", true)
    .order("sort_order");

  if (error || !data) {
    return fallbackArtworks;
  }

  return data.map(mapArtwork);
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  if (!isSupabaseConfigured()) {
    return fallbackArtworks.find((artwork) => artwork.slug === slug) ?? null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("artworks")
    .select(artworkSelect)
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) {
    return null;
  }

  return mapArtwork(data);
}

export async function getAdminArtworks(): Promise<Artwork[]> {
  noStore();

  if (!isSupabaseConfigured()) {
    return fallbackArtworks;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("artworks").select(artworkSelect).order("sort_order");

  if (error || !data) {
    return [];
  }

  return data.map(mapArtwork);
}

export async function getInquiries(): Promise<Inquiry[]> {
  noStore();

  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select("*, artworks(title)")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map(mapInquiry);
}
