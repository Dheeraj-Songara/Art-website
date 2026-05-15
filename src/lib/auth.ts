import "server-only";

import { redirect } from "next/navigation";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type AdminStatus = {
  configured: boolean;
  authenticated: boolean;
  isAdmin: boolean;
  email: string | null;
  userId: string | null;
};

export async function getAdminStatus(): Promise<AdminStatus> {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      authenticated: false,
      isAdmin: false,
      email: null,
      userId: null
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      configured: true,
      authenticated: false,
      isAdmin: false,
      email: null,
      userId: null
    };
  }

  const { data, error } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    configured: true,
    authenticated: true,
    isAdmin: Boolean(data && !error),
    email: user.email ?? null,
    userId: user.id
  };
}

export async function requireAdmin() {
  const status = await getAdminStatus();

  if (!status.configured) {
    return status;
  }

  if (!status.authenticated || !status.isAdmin) {
    redirect("/admin/login");
  }

  return status;
}

export async function assertAdminForMutation() {
  const status = await getAdminStatus();

  if (!status.configured) {
    throw new Error("Supabase is not configured. Add environment variables before using the CMS.");
  }

  if (!status.authenticated || !status.isAdmin) {
    throw new Error("You must be signed in as an admin to make this change.");
  }

  return status;
}
