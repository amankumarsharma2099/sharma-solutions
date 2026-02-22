import { createClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/auth-admin";
import { NextResponse } from "next/server";

const BUCKETS = ["order-documents", "order-documents-admin"] as const;

export async function POST(request: Request) {
  const user = await getCurrentUserRole();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  let body: { bucket?: string; path?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { bucket, path } = body;
  if (!bucket || !path || !BUCKETS.includes(bucket as (typeof BUCKETS)[number])) {
    return NextResponse.json(
      { ok: false, error: "Missing or invalid bucket / path" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(bucket as (typeof BUCKETS)[number])
    .createSignedUrl(path, 3600);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, url: data.signedUrl });
}
