import { forwardRef } from "react";
import { Clock, Loader2, Check } from "lucide-react";

/** Order status + generic variants. Use order variants for orders (pending, in_process, completed). */
export type BadgeVariant =
  | "pending"
  | "in_process"
  | "completed"
  | "approved"
  | "rejected"
  | "default";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** Show status icon (clock/loader/check) for order status — improves accessibility. */
  showIcon?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 border border-yellow-300",
  in_process:
    "bg-blue-100 text-blue-800 border border-blue-300",
  completed:
    "bg-green-100 text-green-800 border border-green-300",
  approved:
    "bg-green-100 text-green-800 border border-green-300",
  rejected:
    "bg-red-100 text-red-800 border border-red-300",
  default:
    "bg-slate-100 text-slate-700 border border-slate-300",
};

function StatusIcon({ variant }: { variant: BadgeVariant }) {
  const size = "w-3.5 h-3.5";
  switch (variant) {
    case "pending":
      return <Clock className={size} aria-hidden />;
    case "in_process":
      return <Loader2 className={`${size} animate-spin`} aria-hidden />;
    case "completed":
    case "approved":
      return <Check className={size} aria-hidden />;
    default:
      return null;
  }
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", showIcon = false, className = "", children, ...props }, ref) => {
    const showStatusIcon =
      showIcon &&
      (variant === "pending" || variant === "in_process" || variant === "completed" || variant === "approved");

    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold transition-colors ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {showStatusIcon && <StatusIcon variant={variant} />}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
