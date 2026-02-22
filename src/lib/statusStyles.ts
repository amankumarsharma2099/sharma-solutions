/**
 * Central order status color mapping — WCAG AA contrast, color-blind friendly.
 * Use everywhere: admin orders, user orders, dashboard, cards, badges.
 */

export type OrderStatusValue = "pending" | "in_process" | "completed";

/** Tailwind classes for status badges (light bg + dark text + visible border). */
export const ORDER_STATUS_STYLES: Record<OrderStatusValue, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 border border-yellow-300",
  in_process:
    "bg-blue-100 text-blue-800 border border-blue-300",
  completed:
    "bg-green-100 text-green-800 border border-green-300",
};

/** Human-readable label for each status. */
export function getOrderStatusLabel(status: string | null): string {
  const s = (status || "pending").toLowerCase();
  if (s === "in_process") return "In Process";
  return (status || "pending").charAt(0).toUpperCase() + (status || "pending").slice(1);
}

/** Map raw status string to OrderStatusValue for styling. */
export function getOrderStatusVariant(status: string | null): OrderStatusValue {
  const s = (status || "").toLowerCase();
  if (s === "in_process") return "in_process";
  if (s === "completed") return "completed";
  return "pending";
}

/** Get full Tailwind class string for a status (for use in non-Badge elements). */
export function getOrderStatusClasses(status: string | null): string {
  return ORDER_STATUS_STYLES[getOrderStatusVariant(status)];
}
