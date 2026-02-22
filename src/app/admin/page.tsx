import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

async function getStats() {
  const supabase = await createClient();

  const [servicesRes, ordersRes] = await Promise.all([
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id, status", { count: "exact" }),
  ]);

  if (servicesRes.error) {
    console.error("admin getStats services error:", servicesRes.error);
  }
  if (ordersRes.error) {
    console.error("admin getStats orders error:", ordersRes.error);
  }

  const totalServices = servicesRes.error ? 0 : (servicesRes.count ?? 0);
  const orders = ordersRes.error ? [] : (ordersRes.data ?? []);
  const totalOrders = ordersRes.error ? 0 : (ordersRes.count ?? orders.length);

  const pending = orders.filter((o) => (o.status || "").toLowerCase() === "pending").length;
  const inProcess = orders.filter((o) => (o.status || "").toLowerCase() === "in_process").length;
  const completed = orders.filter((o) => (o.status || "").toLowerCase() === "completed").length;

  return {
    totalServices,
    totalOrders,
    pending,
    inProcess,
    completed,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Total Services", value: stats.totalServices, color: "blue" },
    { label: "Total Orders", value: stats.totalOrders, color: "slate" },
    { label: "Pending Orders", value: stats.pending, color: "amber" },
    { label: "In Process", value: stats.inProcess, color: "indigo" },
    { label: "Completed Orders", value: stats.completed, color: "emerald" },
  ] as const;

  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
      <p className="mt-1 text-slate-600">
        Overview of services and orders.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <p className="text-sm font-semibold text-slate-600">{label}</p>
              <p
                className={`mt-2 text-2xl font-bold rounded-lg border px-3 py-1.5 inline-block ${colorClasses[color]}`}
              >
                {value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
