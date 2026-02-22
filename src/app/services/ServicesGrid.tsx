"use client";

import { ServiceCard } from "@/components/services/ServiceCard";
import { useAuth } from "@/contexts/AuthContext";
import type { Service } from "@/types/service";

export function ServicesGrid({ services }: { services: Service[] }) {
  const { user } = useAuth();
  const isLoggedIn = !!user?.id;

  const validServices = (services ?? []).filter(
    (s): s is Service => s != null && typeof (s as Service).id === "string"
  );

  return (
    <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {validServices.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          isLoggedIn={isLoggedIn}
        />
      ))}
    </div>
  );
}
