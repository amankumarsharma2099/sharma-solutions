import { createClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/auth-admin";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const ORDER_STATUSES = ["pending", "in_process", "completed"] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

export async function POST(request: Request) {
  const user = await getCurrentUserRole();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  let body: { orderId?: string; status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { orderId, status } = body;
  if (!orderId) {
    return NextResponse.json(
      { ok: false, error: "Missing order id" },
      { status: 400 }
    );
  }
  if (!status || !ORDER_STATUSES.includes(status as OrderStatus)) {
    return NextResponse.json(
      { ok: false, error: "Missing or invalid orderId / status" },
      { status: 400 }
    );
  }

  console.log("API received:", { orderId, newStatus: status });

  const supabase = await createClient();
  // Admin updates by order id only — no user_id filter. RLS "Admins can update any order" allows this.
  const { data: updated, error } = await supabase
    .from("orders")
    .update({ status: status as OrderStatus })
    .eq("id", orderId)
    .select()
    .maybeSingle();

  if (error) {
    console.error("[update-status] Supabase error:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  if (!updated) {
    return NextResponse.json(
      { ok: false, error: "Order not found" },
      { status: 404 }
    );
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  revalidatePath("/orders");
  return NextResponse.json({ ok: true, order: updated });
}
