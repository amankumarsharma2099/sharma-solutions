"use server";

import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/types/service";

type ServiceRow = {
  id: string;
  name: string | null;
  title?: string | null;
  description?: string | null;
  icon?: string | null;
  /** Supabase returns numeric as string; we normalize to number. */
  price?: number | string | null;
  processing_time?: string | null;
  documents_required?: string[] | null;
  is_active?: boolean | null;
};

function rowToService(row: ServiceRow): Service {
  const rawPrice = row.price;
  const priceNum =
    rawPrice != null && rawPrice !== ""
      ? Number(rawPrice)
      : null;
  const price = typeof priceNum === "number" && !Number.isNaN(priceNum) ? priceNum : null;

  return {
    id: row.id,
    title: (row.title ?? row.name ?? "").trim() || "Service",
    description: (row.description ?? "").trim() || "",
    price,
    processing_time: row.processing_time ?? null,
    documents_required: row.documents_required ?? null,
    icon: row.icon ?? null,
  };
}

/** Public list of active services (no auth required). */
export async function getPublicServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, name, title, description, icon, price, processing_time, documents_required, is_active")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getPublicServices:", error);
    return [];
  }
  return (data ?? []).map((row) => rowToService(row as ServiceRow));
}

/** Fetch a single service by id (UUID). Returns null if not found. */
export async function getServiceById(id: string): Promise<Service | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, name, title, description, icon, price, processing_time, documents_required, is_active")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();
  if (error || !data) return null;
  return rowToService(data as ServiceRow);
}
