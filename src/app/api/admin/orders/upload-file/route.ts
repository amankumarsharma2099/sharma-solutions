import { createClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/auth-admin";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const BUCKET = "order-documents-admin";
const ALLOWED_EXT = ["pdf", "jpg", "jpeg", "png", "doc", "docx"];
const MAX_SIZE = 15 * 1024 * 1024; // 15MB

export async function POST(request: Request) {
  const user = await getCurrentUserRole();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const orderId = formData.get("orderId") as string | null;
  const file = formData.get("file") as File | null;

  if (!orderId) {
    return NextResponse.json({ ok: false, error: "Missing orderId" }, { status: 400 });
  }
  if (!file?.size) {
    return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  if (!ALLOWED_EXT.includes(ext)) {
    return NextResponse.json(
      { ok: false, error: "Allowed: PDF, JPG, PNG, DOC, DOCX" },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ ok: false, error: "Max 15MB" }, { status: 400 });
  }

  const safeName = file.name.replace(/[/\\]/g, "_").replace(/\s+/g, "_");
  const path = `${orderId}/${Date.now()}-${safeName}`;

  const supabase = await createClient();
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) {
    return NextResponse.json({ ok: false, error: uploadError.message }, { status: 500 });
  }

  const { error: insertError } = await supabase.from("order_files_admin").insert({
    order_id: orderId,
    file_url: path,
    file_name: file.name,
  });
  if (insertError) {
    return NextResponse.json({ ok: false, error: insertError.message }, { status: 500 });
  }

  revalidatePath("/admin/orders");
  revalidatePath("/orders");
  return NextResponse.json({ ok: true });
}
