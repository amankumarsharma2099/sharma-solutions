"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type PlaceOrderResult = { ok: true; orderId: string } | { ok: false; error: string };

/** Place order with uploaded document paths (client uploads to Storage first, then calls this). */
export async function placeOrderWithDocuments(
  serviceName: string,
  price: number | null,
  documentUrls: string[],
  serviceId?: string | null
): Promise<PlaceOrderResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    if (userError) console.error("Supabase Auth Error:", userError);
    return { ok: false, error: "You must be signed in to place an order." };
  }

  if (!documentUrls?.length) {
    return { ok: false, error: "Please upload at least one document." };
  }

  const { error: upsertError } = await supabase.from("users").upsert(
    {
      id: user.id,
      full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email?.split("@")[0] ?? null,
      email: user.email ?? null,
    },
    { onConflict: "id" }
  );
  if (upsertError) console.error("Supabase Error (users upsert):", upsertError);

  const insertPayload = {
    user_id: user.id,
    status: "pending" as const,
    service_id: serviceId ?? null,
    service_name: serviceName || null,
    price: price ?? null,
    document_urls: documentUrls,
  };

  const { data: order, error } = await supabase
    .from("orders")
    .insert(insertPayload)
    .select("id")
    .single();

  if (error) {
    console.error("Supabase Error:", error);
    console.error("Supabase Error details:", { code: error.code, message: error.message, details: error.details });
    return { ok: false, error: error.message };
  }

  for (let i = 0; i < documentUrls.length; i++) {
    const path = documentUrls[i];
    const fileName = path.split("/").pop() || path;
    await supabase.from("order_files_user").insert({
      order_id: order.id,
      file_url: path,
      file_name: fileName,
    });
  }

  revalidatePath("/orders");
  return { ok: true, orderId: order.id };
}
