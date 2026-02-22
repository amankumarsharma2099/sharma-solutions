import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { getOrderStatusClasses, getOrderStatusLabel } from "@/lib/statusStyles";
import { CSC_CONTACT } from "@/data/services";

type Props = {
  searchParams: Promise<{
    orderId?: string;
    serviceId?: string;
    serviceName?: string;
  }>;
};

export default async function OrderSuccessPage({ searchParams }: Props) {
  const { orderId, serviceId, serviceName: paramServiceName } =
    await searchParams;
  if (!orderId) redirect("/orders");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/orders");

  const { data: order } = await supabase
    .from("orders")
    .select("id, status, created_at, service_id, service_name, price")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (!order) redirect("/orders");

  let serviceName =
    order.service_name ??
    (paramServiceName ? decodeURIComponent(paramServiceName) : null) ??
    "Service";
  if (serviceName === "Service" && order.service_id) {
    const { data: service } = await supabase
      .from("services")
      .select("name")
      .eq("id", order.service_id)
      .single();
    if (service) serviceName = service.name;
  }
  if (serviceName === "Service") {
    const { SERVICES_LIST } = await import("@/data/services");
    const byId = SERVICES_LIST.find((s) => s.slug === serviceId);
    if (byId) serviceName = byId.name;
  }

  const date = new Date(order.created_at).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Container className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-lg">
        <Card className="overflow-hidden border-0 bg-white/90 shadow-2xl shadow-slate-200/50 backdrop-blur-xl">
          <CardContent className="py-12">
            <div className="flex justify-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300">
                <svg
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
            </div>
            <h1 className="mt-8 text-center text-3xl font-bold text-slate-900">
              Order Placed Successfully
            </h1>
            <dl className="mt-10 space-y-4">
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <dt className="text-slate-600">Order ID</dt>
                <dd className="font-mono text-sm font-medium text-slate-900">
                  {order.id}
                </dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <dt className="text-slate-600">Service</dt>
                <dd className="font-semibold text-slate-900">{serviceName}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <dt className="text-slate-600">Date</dt>
                <dd className="text-slate-900">{date}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <dt className="text-slate-600">Status</dt>
                <dd>
                  <span className={`inline-flex rounded-lg border px-2.5 py-0.5 text-sm font-semibold ${getOrderStatusClasses(order.status)}`}>
                    {getOrderStatusLabel(order.status)}
                  </span>
                </dd>
              </div>
              {order.price != null && (
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <dt className="text-slate-600">Amount</dt>
                  <dd className="font-semibold text-slate-900">₹{order.price}</dd>
                </div>
              )}
              <div className="flex justify-between pb-3">
                <dt className="text-slate-600">CSC Contact</dt>
                <dd>
                  {CSC_CONTACT.phones.map((num, i) => (
                    <span key={num}>
                      {i > 0 && ", "}
                      <a
                        href={`tel:${num}`}
                        className="font-semibold text-blue-700 transition-colors hover:text-blue-800 hover:underline"
                      >
                        {num}
                      </a>
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/orders">
                <Button variant="primary" size="lg" fullWidth>
                  View My Orders
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" fullWidth>
                  Back to Services
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
