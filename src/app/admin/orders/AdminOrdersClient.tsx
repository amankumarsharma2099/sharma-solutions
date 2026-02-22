"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { getOrderStatusLabel } from "@/lib/statusStyles";
import type { AdminOrderRow, OrderStatus } from "./actions";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in_process", label: "In Process" },
  { value: "completed", label: "Completed" },
];

async function apiUpdateStatus(orderId: string, status: OrderStatus): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch("/api/admin/orders/update-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, status }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error ?? "Request failed" };
  return data.ok ? { ok: true } : { ok: false, error: data.error };
}

async function apiGetSignedUrl(
  bucket: "order-documents" | "order-documents-admin",
  path: string
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const res = await fetch("/api/admin/orders/signed-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bucket, path }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error ?? "Request failed" };
  return data.ok ? { ok: true, url: data.url } : { ok: false, error: data.error };
}

async function apiUploadAdminFile(orderId: string, formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const body = new FormData();
  body.set("orderId", orderId);
  const file = formData.get("file");
  if (file instanceof File) body.set("file", file);
  const res = await fetch("/api/admin/orders/upload-file", { method: "POST", body });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error ?? "Request failed" };
  return data.ok ? { ok: true } : { ok: false, error: data.error };
}

function formatDate(s: string) {
  return new Date(s).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function FileLink({
  label,
  bucket,
  path,
  onGetUrl,
}: {
  label: string;
  bucket: "order-documents" | "order-documents-admin";
  path: string;
  onGetUrl: (bucket: "order-documents" | "order-documents-admin", path: string) => Promise<string | null>;
}) {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    const url = await onGetUrl(bucket, path);
    setLoading(false);
    if (url) window.open(url, "_blank");
    else toast.error("Could not load file");
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="text-left text-sm font-medium text-blue-700 hover:underline disabled:opacity-50"
    >
      {loading ? "..." : label || path}
    </button>
  );
}

export function AdminOrdersClient({ orders: ordersProp }: { orders: AdminOrderRow[] }) {
  const [orders, setOrders] = useState<AdminOrderRow[]>(ordersProp);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [uploadingOrderId, setUploadingOrderId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setOrders(ordersProp);
  }, [ordersProp]);

  const handleStatusChange = async (order: AdminOrderRow, newStatus: OrderStatus) => {
    const safeOrderId = String(order.id);
    console.log("Sending orderId:", safeOrderId);
    console.log("Order object:", order);
    setStatusUpdating(safeOrderId);
    const result = await apiUpdateStatus(safeOrderId, newStatus);
    setStatusUpdating(null);
    if (result.ok) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, status: newStatus } : o
        )
      );
      router.refresh();
      toast.success("Order status updated");
    } else {
      toast.error(result.error);
    }
  };

  const getUrl = async (bucket: "order-documents" | "order-documents-admin", path: string) => {
    const res = await apiGetSignedUrl(bucket, path);
    return res.ok ? res.url : null;
  };

  const handleUpload = async (orderId: string, formData: FormData) => {
    setUploadingOrderId(orderId);
    const result = await apiUploadAdminFile(orderId, formData);
    setUploadingOrderId(null);
    if (result.ok) {
      toast.success("File uploaded");
      window.location.reload();
    } else toast.error(result.error);
  };

  if (orders.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="py-12 text-center">
          <p className="text-slate-700">No orders yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      {orders.map((order) => {
        const userName = order.user?.full_name ?? "No name";
        const userEmail = order.user?.email ?? "No email";
        const userPhone = order.user?.phone ?? "—";
        const serviceName = order.service_name || order.service_id || "—";
        const status = (order.status || "pending").toLowerCase() as OrderStatus;
        const effectiveStatus: OrderStatus =
          status === "in_process" ? "in_process" : status === "completed" ? "completed" : "pending";

        const userFilePaths: { path: string; name: string }[] = [
          ...(order.user_files ?? []).map((f) => ({ path: f.file_url, name: f.file_name || f.file_url })),
          ...((order.document_urls ?? []).map((p) => ({ path: p, name: p.split("/").pop() || p }))),
        ];
        const uniquePaths = Array.from(new Map(userFilePaths.map((x) => [x.path, x])).values());

        const isCompleted = effectiveStatus === "completed";

        return (
          <Card key={order.id}>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-sm text-slate-600">{order.id}</p>
                  <p className="mt-1 font-semibold text-slate-900">{serviceName}</p>
                  <p className="mt-1 text-sm text-slate-700">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={effectiveStatus} showIcon>
                    {getOrderStatusLabel(effectiveStatus)}
                  </Badge>
                  <select
                    value={effectiveStatus}
                    onChange={(e) => {
                      handleStatusChange(order, e.target.value as OrderStatus);
                    }}
                    disabled={statusUpdating === order.id}
                    className="rounded-xl border-2 border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-blue-600 focus:outline-none"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {statusUpdating === order.id && <span className="text-xs text-slate-600">Updating...</span>}
                </div>
              </div>

              <div className="mt-4 grid gap-4 border-t border-slate-200 pt-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600">User</h4>
                  <p className="mt-1 text-sm font-medium text-slate-900">{userName}</p>
                  <p className="text-sm text-slate-700">{userEmail}</p>
                  <p className="text-sm text-slate-700">{userPhone}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600">User uploaded files</h4>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {uniquePaths.length === 0 ? (
                      <span className="text-sm text-slate-600">None</span>
                    ) : (
                      uniquePaths.map(({ path, name }) => (
                        <FileLink
                          key={path}
                          label={name}
                          bucket="order-documents"
                          path={path}
                          onGetUrl={getUrl}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>

              {isCompleted && (
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Admin attached files
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(order.admin_files ?? []).map((f) => (
                      <FileLink
                        key={f.id}
                        label={f.file_name || f.file_url}
                        bucket="order-documents-admin"
                        path={f.file_url}
                        onGetUrl={getUrl}
                      />
                    ))}
                  </div>
                  <form
                    className="mt-3 flex flex-wrap items-end gap-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      handleUpload(order.id, formData);
                    }}
                  >
                    <input
                      type="file"
                      name="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      required
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={uploadingOrderId === order.id}
                      isLoading={uploadingOrderId === order.id}
                    >
                      Upload file
                    </Button>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
