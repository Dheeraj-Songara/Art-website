"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

const inquirySchema = z.object({
  artworkId: z.string().min(1).nullable().optional(),
  name: z.string().min(2, "Enter your name."),
  email: z.string().email("Enter a valid email."),
  message: z.string().min(10, "Tell us a little more about your inquiry."),
  budget: z.string().trim().optional()
});

export type InquiryActionState = {
  ok: boolean;
  message: string;
};

export async function createInquiryAction(
  _state: InquiryActionState,
  formData: FormData
): Promise<InquiryActionState> {
  const parsed = inquirySchema.safeParse({
    artworkId: formData.get("artworkId") || null,
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    budget: formData.get("budget") || null
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Please check the form."
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      ok: true,
      message: "Inquiry captured in preview mode. Connect Supabase to store messages."
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("inquiries").insert({
    artwork_id: parsed.data.artworkId,
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
    budget: parsed.data.budget || null,
    status: "new"
  });

  if (error) {
    return {
      ok: false,
      message: "The inquiry could not be sent. Please email the gallery directly."
    };
  }

  revalidatePath("/admin/inquiries");

  return {
    ok: true,
    message: "Message received. We will be in touch shortly."
  };
}
