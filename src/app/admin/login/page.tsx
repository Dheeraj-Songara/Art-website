import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SignInForm } from "@/components/admin/sign-in-form";
import { getAdminStatus } from "@/lib/auth";

export default async function AdminLoginPage() {
  const status = await getAdminStatus();

  if (status.configured && status.authenticated && status.isAdmin) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-[calc(100vh-60px)] items-center justify-center px-5 py-16">
      <Suspense fallback={<div className="luxury-panel w-full max-w-[400px] p-8">Loading...</div>}>
        <SignInForm />
      </Suspense>
    </main>
  );
}
