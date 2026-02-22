"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-admin";

const ORDER_STATUSES = ["pending", "in_process", "completed"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type AdminOrderRow = {
  id: string;
  user_id: string;
  service_id: string | null;
  service_name: string | null;
  status: string | null;
  price: number | null;
  document_urls: string[] | null;
  created_at: string;
  user?: { full_name: string | null; phone: string | null; email: string | null } | null;
  user_files?: { id: string; file_url: string; file_name: string | null }[];
  admin_files?: { id: string; file_url: string; file_name: string | null; created_at: string }[];
};

export async function getAdminOrders(): Promise<AdminOrderRow[]> {
  await requireAdmin();
  const supabase = await createClient();

  // CRITICAL: No user_id filter — admin must see ALL orders from all users.
  // RLS policy "Admins can view all orders" (migration 20250221110000) must be applied.
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id, user_id, service_id, service_name, status, price, document_urls, created_at")
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("admin query error (orders):", ordersError);
    return [];
  }
  if (!orders?.length) {
    return [];
  }

  const userIds = [...new Set((orders as { user_id: string }[]).map((o) => o.user_id))];
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id, full_name, phone, email")
    .in("id", userIds);

  if (usersError) {
    console.error("admin query error (users for orders):", usersError);
  }
  const userMap = new Map((users ?? []).map((u) => [u.id, u]));

  const orderIds = orders.map((o) => o.id);
  const [userFilesRes, adminFilesRes] = await Promise.all([
    supabase.from("order_files_user").select("id, order_id, file_url, file_name").in("order_id", orderIds),
    supabase.from("order_files_admin").select("id, order_id, file_url, file_name, created_at").in("order_id", orderIds),
  ]);

  const userFilesByOrder = new Map<string, { id: string; file_url: string; file_name: string | null }[]>();
  (userFilesRes.data ?? []).forEach((f: { order_id: string; id: string; file_url: string; file_name: string | null }) => {
    const list = userFilesByOrder.get(f.order_id) ?? [];
    list.push({ id: f.id, file_url: f.file_url, file_name: f.file_name });
    userFilesByOrder.set(f.order_id, list);
  });
  const adminFilesByOrder = new Map<string, { id: string; file_url: string; file_name: string | null; created_at: string }[]>();
  (adminFilesRes.data ?? []).forEach((f: { order_id: string; id: string; file_url: string; file_name: string | null; created_at: string }) => {
    const list = adminFilesByOrder.get(f.order_id) ?? [];
    list.push({ id: f.id, file_url: f.file_url, file_name: f.file_name, created_at: f.created_at });
    adminFilesByOrder.set(f.order_id, list);
  });

  return orders.map((o) => ({
    ...o,
    user: userMap.get(o.user_id) ?? null,
    user_files: userFilesByOrder.get(o.id) ?? [],
    admin_files: adminFilesByOrder.get(o.id) ?? [],
  })) as AdminOrderRow[];
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();
  const supabase = await createClient();
  const { data: updated, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!updated) return { ok: false, error: "Order not found" };
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  revalidatePath("/orders");
  return { ok: true };
}

/** Generate a signed URL for viewing/downloading a file (user or admin bucket). */
export async function getSignedFileUrl(
  bucket: "order-documents" | "order-documents-admin",
  path: string,
  expiresIn = 3600
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
  if (error) return { ok: false, error: error.message };
  return { ok: true, url: data.signedUrl };
}

/** Upload admin file for an order and insert into order_files_admin. */
export async function uploadAdminOrderFile(
  orderId: string,
  file: { name: string; type: string; size: number },
  formData: FormData
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();
  const supabase = await createClient();

  const bucket = "order-documents-admin";
  const rawFile = formData.get("file") as File | null;
  if (!rawFile?.size) return { ok: false, error: "No file provided" };

  const ext = rawFile.name.split(".").pop()?.toLowerCase() || "";
  const allowed = ["pdf", "jpg", "jpeg", "png", "doc", "docx"];
  if (!allowed.includes(ext)) return { ok: false, error: "Allowed: PDF, JPG, PNG, DOC, DOCX" };
  if (rawFile.size > 15 * 1024 * 1024) return { ok: false, error: "Max 15MB" };

  const safeName = rawFile.name.replace(/[/\\]/g, "_").replace(/\s+/g, "_");
  const path = `${orderId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, rawFile, {
    contentType: rawFile.type,
    upsert: false,
  });
  if (uploadError) return { ok: false, error: uploadError.message };

  const { error: insertError } = await supabase.from("order_files_admin").insert({
    order_id: orderId,
    file_url: path,
    file_name: rawFile.name,
  });
  if (insertError) return { ok: false, error: insertError.message };

  revalidatePath("/admin/orders");
  revalidatePath("/orders");
  return { ok: true };
}
