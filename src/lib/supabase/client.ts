import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

/**
 * Single global Supabase client for the browser. Use this everywhere in client components
 * so auth state and subscriptions are shared across the app. Initialized once only.
 */
export function createClient(): SupabaseClient {
  if (browserClient) return browserClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    if (typeof window !== "undefined") {
      console.error("Supabase: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Check .env.local.");
    }
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  if (process.env.NODE_ENV === "development") {
    console.log("Supabase: URL configured:", !!url, "| Anon key configured:", !!key);
  }
  browserClient = createBrowserClient(url, key);
  return browserClient;
}
