import { getAdminOrders } from "./actions";
import { AdminOrdersClient } from "./AdminOrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();
  console.log("Admin orders count:", orders?.length ?? 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Orders Management</h1>
      <p className="mt-1 text-slate-600">
        View orders, update status, and attach completion files.
      </p>

      <AdminOrdersClient orders={orders} />
    </div>
  );
}
