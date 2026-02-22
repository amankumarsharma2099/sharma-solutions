import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type AdminUser = {
  id: string;
  email: string | undefined;
  role: string;
};

/**
 * Get current user and ensure they are admin. Redirects to home if not logged in, to / if not admin.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createClient();
  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (process.env.NODE_ENV === "development") {
    console.log("admin session:", user?.id ? { id: user.id, email: user.email } : null);
  }
  if (sessionError) {
    console.error("admin session error:", sessionError);
    redirect("/login?redirect=/admin");
  }
  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("admin query error (users.role):", profileError);
    redirect("/");
  }

  const role = (profile?.role as string) ?? "user";
  if (role !== "admin") {
    redirect("/");
  }

  return {
    id: user.id,
    email: user.email,
    role,
  };
}

/**
 * Get current user and role. Returns null if not logged in.
 */
export async function getCurrentUserRole(): Promise<{ id: string; role: string } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    role: (profile?.role as string) ?? "user",
  };
}
