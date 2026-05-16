"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { assertAdminForMutation } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseTags, slugify, toNullableNumber, toNullableString } from "@/lib/utils";

export type AdminActionResult = {
  ok: boolean;
  message: string;
};

const availabilitySchema = z.enum(["available", "reserved", "sold", "private"]);

function actionError(error: unknown): AdminActionResult {
  return {
    ok: false,
    message: error instanceof Error ? error.message : "The CMS action failed."
  };
}

function revalidateCms() {
  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin");
  revalidatePath("/admin/artworks");
  revalidatePath("/admin/collections");
  revalidatePath("/admin/content");
  revalidatePath("/admin/inquiries");
}

export async function saveArtworkAction(formData: FormData): Promise<AdminActionResult> {
  try {
    await assertAdminForMutation();
    const supabase = await createSupabaseServerClient();

    const title = String(formData.get("title") ?? "").trim();
    if (!title) {
      return { ok: false, message: "Title is required." };
    }

    const id = toNullableString(formData.get("id"));
    const explicitSlug = toNullableString(formData.get("slug"));
    const availability = availabilitySchema.parse(formData.get("availability") ?? "available");

    const payload = {
      title,
      slug: explicitSlug ?? slugify(title),
      description: String(formData.get("description") ?? "").trim(),
      category: String(formData.get("category") ?? "Uncategorized").trim(),
      collection_id: toNullableString(formData.get("collectionId")),
      tags: parseTags(formData.get("tags")),
      price: toNullableNumber(formData.get("price")),
      currency: String(formData.get("currency") ?? "USD").trim() || "USD",
      dimensions: toNullableString(formData.get("dimensions")),
      availability,
      buy_link: toNullableString(formData.get("buyLink")),
      image_url: toNullableString(formData.get("imageUrl")),
      image_public_id: toNullableString(formData.get("imagePublicId")),
      thumbnail_url: toNullableString(formData.get("thumbnailUrl")),
      images: JSON.parse(String(formData.get("images") ?? "[]")),
      blur_data_url: toNullableString(formData.get("blurDataUrl")),
      featured: formData.get("featured") === "on",
      homepage_featured: formData.get("homepageFeatured") === "on",
      published: formData.get("published") === "on",
      sort_order: Number(formData.get("sortOrder") ?? 0),
      gradient_index: Number(formData.get("gradientIndex") ?? 0),
      seo_title: toNullableString(formData.get("seoTitle")),
      seo_description: toNullableString(formData.get("seoDescription"))
    };

    const query = id
      ? supabase.from("artworks").update(payload).eq("id", id)
      : supabase.from("artworks").insert(payload);

    const { error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    revalidateCms();
    revalidatePath(`/artworks/${payload.slug}`);

    return {
      ok: true,
      message: id ? "Artwork updated." : "Artwork created."
    };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteArtworkAction(id: string): Promise<AdminActionResult> {
  try {
    await assertAdminForMutation();
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("artworks").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidateCms();

    return { ok: true, message: "Artwork deleted." };
  } catch (error) {
    return actionError(error);
  }
}

export async function reorderArtworksAction(ids: string[]): Promise<AdminActionResult> {
  try {
    await assertAdminForMutation();
    const supabase = await createSupabaseServerClient();

    const updates = ids.map((id, index) =>
      supabase.from("artworks").update({ sort_order: index + 1 }).eq("id", id)
    );

    const results = await Promise.all(updates);
    const failed = results.find((result) => result.error);

    if (failed?.error) {
      throw new Error(failed.error.message);
    }

    revalidateCms();

    return { ok: true, message: "Artwork order saved." };
  } catch (error) {
    return actionError(error);
  }
}

export async function toggleArtworkFlagAction(
  id: string,
  field: "featured" | "homepage_featured" | "published",
  value: boolean
): Promise<AdminActionResult> {
  try {
    await assertAdminForMutation();
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("artworks").update({ [field]: value }).eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidateCms();

    return { ok: true, message: "Artwork flag updated." };
  } catch (error) {
    return actionError(error);
  }
}

export async function saveCollectionAction(formData: FormData): Promise<AdminActionResult> {
  try {
    await assertAdminForMutation();
    const supabase = await createSupabaseServerClient();
    const title = String(formData.get("title") ?? "").trim();

    if (!title) {
      return { ok: false, message: "Collection title is required." };
    }

    const id = toNullableString(formData.get("id"));
    const payload = {
      title,
      slug: toNullableString(formData.get("slug")) ?? slugify(title),
      description: toNullableString(formData.get("description")),
      sort_order: Number(formData.get("sortOrder") ?? 0),
      featured: formData.get("featured") === "on",
      seo_title: toNullableString(formData.get("seoTitle")),
      seo_description: toNullableString(formData.get("seoDescription"))
    };

    const query = id
      ? supabase.from("collections").update(payload).eq("id", id)
      : supabase.from("collections").insert(payload);

    const { error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    revalidateCms();

    return { ok: true, message: id ? "Collection updated." : "Collection created." };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteCollectionAction(id: string): Promise<AdminActionResult> {
  try {
    await assertAdminForMutation();
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("collections").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidateCms();

    return { ok: true, message: "Collection deleted." };
  } catch (error) {
    return actionError(error);
  }
}

export async function saveHomepageContentAction(formData: FormData): Promise<AdminActionResult> {
  try {
    await assertAdminForMutation();
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("homepage_content").upsert({
      id: 1,
      hero_title: String(formData.get("heroTitle") ?? ""),
      hero_subtitle: String(formData.get("heroSubtitle") ?? ""),
      hero_cta_label: String(formData.get("heroCtaLabel") ?? ""),
      hero_cta_href: String(formData.get("heroCtaHref") ?? "/collections"),
      featured_section_title: String(formData.get("featuredSectionTitle") ?? "Featured Work"),
      seo_title: String(formData.get("seoTitle") ?? ""),
      seo_description: String(formData.get("seoDescription") ?? "")
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidateCms();
    return { ok: true, message: "Homepage content saved." };
  } catch (error) {
    return actionError(error);
  }
}

export async function saveAboutContentAction(formData: FormData): Promise<AdminActionResult> {
  try {
    await assertAdminForMutation();
    const supabase = await createSupabaseServerClient();
    const metricsRaw = String(formData.get("metrics") ?? "[]");
    const metrics = JSON.parse(metricsRaw) as Array<{ label: string; value: string }>;
    const { error } = await supabase.from("about_content").upsert({
      id: 1,
      label: String(formData.get("label") ?? ""),
      title: String(formData.get("title") ?? ""),
      italic_title: String(formData.get("italicTitle") ?? ""),
      body: String(formData.get("body") ?? ""),
      secondary_body: String(formData.get("secondaryBody") ?? ""),
      metrics,
      seo_title: String(formData.get("seoTitle") ?? ""),
      seo_description: String(formData.get("seoDescription") ?? "")
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidateCms();
    return { ok: true, message: "About page content saved." };
  } catch (error) {
    return actionError(error);
  }
}

export async function saveContactInfoAction(formData: FormData): Promise<AdminActionResult> {
  try {
    await assertAdminForMutation();
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("contact_info").upsert({
      id: 1,
      heading: String(formData.get("heading") ?? ""),
      italic_heading: String(formData.get("italicHeading") ?? ""),
      email: String(formData.get("email") ?? ""),
      location: String(formData.get("location") ?? ""),
      instagram: String(formData.get("instagram") ?? ""),
      phone: toNullableString(formData.get("phone")),
      seo_title: String(formData.get("seoTitle") ?? ""),
      seo_description: String(formData.get("seoDescription") ?? "")
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidateCms();
    return { ok: true, message: "Contact information saved." };
  } catch (error) {
    return actionError(error);
  }
}

export async function saveSiteSettingsAction(formData: FormData): Promise<AdminActionResult> {
  try {
    await assertAdminForMutation();
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("site_settings").upsert({
      id: 1,
      site_name: String(formData.get("siteName") ?? ""),
      logo_text: String(formData.get("logoText") ?? ""),
      accent_color: String(formData.get("accentColor") ?? "#4fd1c5"),
      default_seo_title: String(formData.get("defaultSeoTitle") ?? ""),
      default_seo_description: String(formData.get("defaultSeoDescription") ?? ""),
      og_image_url: toNullableString(formData.get("ogImageUrl"))
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidateCms();
    return { ok: true, message: "Site settings saved." };
  } catch (error) {
    return actionError(error);
  }
}

export async function saveSocialLinksAction(formData: FormData): Promise<AdminActionResult> {
  try {
    await assertAdminForMutation();
    const supabase = await createSupabaseServerClient();
    const links = JSON.parse(String(formData.get("socialLinks") ?? "[]")) as Array<{
      label: string;
      url: string;
      sortOrder?: number;
    }>;

    const { error: deleteError } = await supabase.from("social_links").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (deleteError) {
      throw new Error(deleteError.message);
    }

    if (links.length > 0) {
      const { error } = await supabase.from("social_links").insert(
        links
          .filter((link) => link.label && link.url)
          .map((link, index) => ({
            label: link.label,
            url: link.url,
            sort_order: link.sortOrder ?? index + 1
          }))
      );

      if (error) {
        throw new Error(error.message);
      }
    }

    revalidateCms();
    return { ok: true, message: "Social links saved." };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateInquiryStatusAction(
  id: string,
  status: "new" | "contacted" | "closed"
): Promise<AdminActionResult> {
  try {
    await assertAdminForMutation();
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidateCms();
    return { ok: true, message: "Inquiry status updated." };
  } catch (error) {
    return actionError(error);
  }
}
