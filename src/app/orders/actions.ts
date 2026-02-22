"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Get a signed URL to download an admin-attached file for an order.
 * Only allowed if the order belongs to the current user and the file is in order_files_admin.
 */
export async function getOrderAdminFileDownloadUrl(
  orderId: string,
  filePath: string
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  const { data: order } = await supabase
    .from("orders")
    .select("id, user_id")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();
  if (!order) return { ok: false, error: "Order not found" };

  const { data: fileRow } = await supabase
    .from("order_files_admin")
    .select("id")
    .eq("order_id", orderId)
    .eq("file_url", filePath)
    .single();
  if (!fileRow) return { ok: false, error: "File not found" };

  const { data, error } = await supabase.storage
    .from("order-documents-admin")
    .createSignedUrl(filePath, 3600);
  if (error) return { ok: false, error: error.message };
  return { ok: true, url: data.signedUrl };
}
