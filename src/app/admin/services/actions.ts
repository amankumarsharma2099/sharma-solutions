"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-admin";

type ServiceRow = {
  id: string;
  name: string | null;
  title?: string | null;
  description?: string | null;
  icon?: string | null;
  category?: string | null;
  is_active?: boolean | null;
  price?: number | null;
  processing_time?: string | null;
  documents_required?: string[] | null;
  created_at?: string | null;
};

export type ServiceFormData = {
  title: string;
  description: string;
  icon: string;
  category: string;
  isActive: boolean;
  price: string;
  processingTime: string;
  documentsRequiredText: string;
};

export async function getAdminServices(): Promise<ServiceRow[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getAdminServices:", error);
    return [];
  }
  return (data ?? []) as ServiceRow[];
}

export async function createService(form: ServiceFormData): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();
  const supabase = await createClient();
  const documentsArray = form.documentsRequiredText
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const payload = {
    name: form.title.trim(),
    title: form.title.trim(),
    description: form.description.trim() || null,
    icon: form.icon.trim() || null,
    category: form.category.trim() || null,
    is_active: form.isActive,
    price: form.price.trim() ? Number(form.price.trim()) : null,
    processing_time: form.processingTime.trim() || null,
    documents_required: documentsArray.length > 0 ? documentsArray : null,
  };
  const { error } = await supabase.from("services").insert(payload);
  if (error) {
    console.error("createService:", error);
    return { ok: false, error: error.message };
  }
  revalidatePath("/admin");
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { ok: true };
}

export async function updateService(
  id: string,
  form: ServiceFormData
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();
  const supabase = await createClient();
  const documentsArray = form.documentsRequiredText
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const payload = {
    name: form.title.trim(),
    title: form.title.trim(),
    description: form.description.trim() || null,
    icon: form.icon.trim() || null,
    category: form.category.trim() || null,
    is_active: form.isActive,
    price: form.price.trim() ? Number(form.price.trim()) : null,
    processing_time: form.processingTime.trim() || null,
    documents_required: documentsArray.length > 0 ? documentsArray : null,
  };
  const { error } = await supabase.from("services").update(payload).eq("id", id);
  if (error) {
    console.error("updateService:", error);
    return { ok: false, error: error.message };
  }
  revalidatePath("/admin");
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { ok: true };
}

export async function deleteService(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) {
    console.error("deleteService:", error);
    return { ok: false, error: error.message };
  }
  revalidatePath("/admin");
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { ok: true };
}
