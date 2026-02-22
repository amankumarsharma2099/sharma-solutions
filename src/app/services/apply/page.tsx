import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { getServiceBySlug } from "@/data/services";
import { getServiceById } from "@/lib/services-public";
import { ApplyForm } from "./ApplyForm";
import type { Service } from "@/types/service";

export const dynamic = "force-dynamic";

function isUuid(s: string): boolean {
  return s.length === 36 && /^[0-9a-f-]{36}$/i.test(s);
}

/** Map hardcoded ServiceItem to unified Service for backward compatibility. */
function legacyItemToService(item: ReturnType<typeof getServiceBySlug>): Service | null {
  if (!item) return null;
  return {
    id: item.slug,
    title: item.name,
    description: item.description,
    price: item.price ?? null,
    processing_time: item.time ?? null,
    documents_required: item.documentsRequired?.length ? item.documentsRequired : null,
    icon: item.icon ?? null,
  };
}

type Props = { searchParams: Promise<{ service?: string }> };

export default async function ApplyPage({ searchParams }: Props) {
  const { service: param } = await searchParams;
  if (!param) redirect("/services");

  let service: Service | null = null;
  if (isUuid(param)) {
    service = await getServiceById(param);
  } else {
    const legacy = getServiceBySlug(param);
    service = legacyItemToService(legacy);
  }
  if (!service) redirect("/services");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?redirect=" + encodeURIComponent("/services/apply?service=" + encodeURIComponent(param)));
  }

  return (
    <Container className="py-12 sm:py-16 lg:py-20">
      <ApplyForm service={service} />
    </Container>
  );
}
