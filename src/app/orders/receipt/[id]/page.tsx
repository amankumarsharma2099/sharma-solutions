import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { getOrderStatusClasses, getOrderStatusLabel } from "@/lib/statusStyles";
import { CSC_CONTACT } from "@/data/services";
import { SERVICES_LIST } from "@/data/services";
import { PrintButton } from "../PrintButton";

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/orders");

  const { data: order } = await supabase
    .from("orders")
    .select("id, user_id, service_id, service_name, status, price, created_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!order) notFound();

  let serviceName = order.service_name ?? "Service";
  if (serviceName === "Service" && order.service_id) {
    const { data: service } = await supabase
      .from("services")
      .select("name")
      .eq("id", order.service_id)
      .single();
    if (service) serviceName = service.name;
    else {
      const fallback = SERVICES_LIST.find((s) => s.slug === order.service_id);
      if (fallback) serviceName = fallback.name;
    }
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
        <Card id="receipt" className="print:shadow-none">
          <CardContent className="py-10">
            <div className="border-b border-slate-200 pb-6">
              <h1 className="text-2xl font-bold text-slate-900">
                Sharma Solutions
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                CSC Service Receipt
              </p>
            </div>
            <dl className="mt-8 space-y-4">
              <div className="flex justify-between">
                <dt className="text-slate-600">Order ID</dt>
                <dd className="font-mono text-sm font-medium text-slate-900">
                  {order.id}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Service</dt>
                <dd className="font-semibold text-slate-900">{serviceName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Date</dt>
                <dd className="text-slate-900">{date}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Status</dt>
                <dd>
                  <span className={`inline-flex rounded-lg border px-2.5 py-0.5 text-sm font-semibold ${getOrderStatusClasses(order.status)}`}>
                    {getOrderStatusLabel(order.status)}
                  </span>
                </dd>
              </div>
              {order.price != null && (
                <div className="flex justify-between">
                  <dt className="text-slate-600">Amount</dt>
                  <dd className="font-semibold text-slate-900">₹{order.price}</dd>
                </div>
              )}
            </dl>
            <div className="mt-8 border-t border-slate-200 pt-6">
              <p className="text-sm text-slate-600">
                CSC Contact:{" "}
                {CSC_CONTACT.phones.map((num, i) => (
                  <span key={num}>
                    {i > 0 && ", "}
                    <a
                      href={`tel:${num}`}
                      className="font-semibold text-blue-700 hover:underline"
                    >
                      {num}
                    </a>
                  </span>
                ))}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {CSC_CONTACT.address}
              </p>
            </div>
          </CardContent>
        </Card>
        <PrintButton />
      </div>
    </Container>
  );
}
