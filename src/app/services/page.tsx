import { ServicesGrid } from "./ServicesGrid";
import { getPublicServices } from "@/lib/services-public";
import { Container } from "@/components/ui/Container";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await getPublicServices();
  if (process.env.NODE_ENV === "development") {
    console.log("Services loaded:", services);
  }

  return (
    <Container className="py-12 md:py-16">
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          Our Services
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Select a service and click Apply Now. You need to be signed in to
          place an order.
        </p>
      </div>
      <ServicesGrid services={services} />
    </Container>
  );
}
