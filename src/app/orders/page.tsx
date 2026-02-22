import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { getOrderStatusLabel, getOrderStatusVariant } from "@/lib/statusStyles";
import { SERVICES_LIST } from "@/data/services";
import { OrderAdminFilesDownload } from "./OrderAdminFilesDownload";
import { OrdersRealtimeSync } from "./OrdersRealtimeSync";

export const dynamic = "force-dynamic";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/orders");

  const { data: orders } = await supabase
    .from("orders")
    .select("id, service_id, service_name, status, price, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orderIds = (orders ?? []).map((o) => o.id);
  const { data: adminFilesRows } =
    orderIds.length > 0
      ? await supabase
          .from("order_files_admin")
          .select("order_id, file_url, file_name")
          .in("order_id", orderIds)
      : { data: [] };
  const adminFilesByOrderId = new Map<string, { file_url: string; file_name: string | null }[]>();
  (adminFilesRows ?? []).forEach((r: { order_id: string; file_url: string; file_name: string | null }) => {
    const list = adminFilesByOrderId.get(r.order_id) ?? [];
    list.push({ file_url: r.file_url, file_name: r.file_name });
    adminFilesByOrderId.set(r.order_id, list);
  });

  const serviceIds = Array.from(
    new Set((orders ?? []).map((o) => o.service_id).filter(Boolean) as string[])
  );
  const { data: services } =
    serviceIds.length > 0
      ? await supabase.from("services").select("id, name").in("id", serviceIds)
      : { data: [] };
  const serviceMap = new Map((services ?? []).map((s) => [s.id, s.name]));

  function getServiceName(order: {
    service_id: string | null;
    service_name: string | null;
  }) {
    if (order.service_name) return order.service_name;
    if (order.service_id)
      return (
        serviceMap.get(order.service_id) ??
        SERVICES_LIST.find((s) => s.slug === order.service_id)?.name ??
        "Service"
      );
    return "Service";
  }

  return (
    <Container className="py-12 sm:py-16 lg:py-20">
      <OrdersRealtimeSync />
      <div className="text-center sm:text-left">
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
          My Orders
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          View and download receipts for your orders.
        </p>
      </div>

      {!orders || orders.length === 0 ? (
        <Card className="mt-12">
          <CardContent className="py-16 text-center">
            <p className="text-lg text-slate-600">
              You haven&apos;t placed any orders yet.
            </p>
            <Link href="/services" className="mt-6 inline-block">
              <Button variant="primary" size="lg">
                Browse Services
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <ul className="mt-12 space-y-6">
          {orders.map((order) => (
            <li key={order.id}>
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <CardContent className="flex flex-col gap-6 py-6 sm:flex-row sm:items-start sm:justify-between sm:py-6">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3 gap-y-2">
                      <p className="text-lg font-semibold text-slate-900">
                        {getServiceName(order)}
                      </p>
                      <Badge variant={getOrderStatusVariant(order.status)} showIcon>
                        {getOrderStatusLabel(order.status)}
                      </Badge>
                    </div>
                    <p className="font-mono text-sm text-slate-600">
                      {order.id}
                    </p>
                    <p className="text-sm text-slate-700">
                      {formatDate(order.created_at)}
                    </p>
                    {order.price != null && (
                      <p className="text-sm font-semibold text-slate-700">
                        ₹{order.price}
                      </p>
                    )}
                    <OrderAdminFilesDownload
                      orderId={order.id}
                      files={adminFilesByOrderId.get(order.id) ?? []}
                    />
                  </div>
                  <Link
                    href={`/orders/receipt/${order.id}`}
                    className="shrink-0"
                  >
                    <Button variant="outline" size="md">
                      Download Receipt
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
