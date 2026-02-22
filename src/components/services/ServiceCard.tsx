"use client";

import Link from "next/link";
import { ServiceIcon } from "@/components/icons/ServiceIcon";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import type { Service } from "@/types/service";

type ServiceCardProps = {
  service: Service;
  isLoggedIn?: boolean;
  applyHref?: string;
  onApply?: (serviceId: string, serviceName: string) => void;
};

export function ServiceCard({
  service,
  applyHref,
  onApply,
  isLoggedIn = false,
}: ServiceCardProps) {
  if (!service) {
    console.warn("ServiceCard received undefined service");
    return null;
  }
  if (!service?.id) return null;

  const { id, title, description, icon, price } = service;
  const priceNum = price != null ? Number(price) : null;
  const showPrice = typeof priceNum === "number" && !Number.isNaN(priceNum);
  const applyPath = `/services/apply?service=${encodeURIComponent(id)}`;
  const href = applyHref ?? (isLoggedIn ? applyPath : `/login?redirect=${encodeURIComponent(applyPath)}`);

  return (
    <Card hover className="flex h-full flex-col">
      <CardHeader className="pb-2">
        <div className="mb-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 border border-blue-200">
          <ServiceIcon name={icon ?? null} className="h-6 w-6 text-blue-800" />
        </div>
        <CardTitle className="text-lg leading-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pt-2">
        <p className="text-sm leading-relaxed text-slate-600 line-clamp-2">
          {description || "Government service offered at our CSC center."}
        </p>
        {showPrice && (
          <p className="mt-2 text-sm font-semibold text-blue-700">₹{priceNum}</p>
        )}
      </CardContent>
      <CardFooter className="mt-auto pt-4">
        {onApply ? (
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => onApply(id, title)}
          >
            Apply Now
          </Button>
        ) : (
          <Link href={href} className="block w-full">
            <Button variant="primary" size="sm" fullWidth>
              Apply Now
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
