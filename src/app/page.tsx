import Link from "next/link";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SERVICES_LIST, CSC_CONTACT } from "@/data/services";

const SECTION_PADDING = "py-12 md:py-16";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className={`relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-50 ${SECTION_PADDING}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent" />
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="animate-fade-in text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Government Services,{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                Simplified
              </span>
            </h1>
            <p className="animate-fade-in mx-auto mt-4 text-xl text-slate-600 sm:text-2xl [animation-delay:0.1s]">
              Sharma Solutions is your trusted CSC center. Access Aadhaar, voter
              ID, insurance, and more—all under one roof.
            </p>
            <div className="animate-fade-in mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row [animation-delay:0.2s]">
              <Link href="/services">
                <Button variant="primary" size="lg">
                  Explore Services
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Trust Section */}
      <section className={`border-y border-slate-200/80 bg-white ${SECTION_PADDING}`}>
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14 lg:gap-20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 border border-blue-200">
                <svg
                  className="h-6 w-6 text-blue-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Official CSC</p>
                <p className="text-sm text-slate-600">Registered Center</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 border border-blue-200">
                <svg
                  className="h-6 w-6 text-blue-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Quick Turnaround</p>
                <p className="text-sm text-slate-600">Fast Processing</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 border border-blue-200">
                <svg
                  className="h-6 w-6 text-blue-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Transparent</p>
                <p className="text-sm text-slate-600">Clear Pricing</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Our Services - All 7 services */}
      <section className={SECTION_PADDING}>
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Our Services
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-600">
              Government and CSC services under one roof. Select a service and apply.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {SERVICES_LIST.map((s) => (
              <ServiceCard
                key={s.slug}
                service={{
                  id: s.slug,
                  title: s.name,
                  description: s.description,
                  icon: s.icon,
                  price: s.price,
                }}
                applyHref="/services"
              />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link href="/services">
              <Button variant="outline" size="lg">
                View All Services
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* About Section */}
      <section className={`border-t border-slate-200/80 bg-slate-50/50 ${SECTION_PADDING}`}>
        <Container>
          <Card className="overflow-hidden p-6 md:p-10 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                  Your Trusted CSC Partner
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-600">
                  Sharma Solutions is your trusted Common Service Centre (CSC),
                  offering a wide range of government-to-citizen and other
                  utility services under one roof. From Aadhaar and voter ID to
                  insurance and bill payments, we are here to make your life
                  easier with reliable, quick, and transparent service.
                </p>
                <Link href="/about" className="mt-6 inline-block">
                  <Button variant="primary" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-blue-50 p-5">
                  <p className="text-3xl font-bold text-blue-800">12+</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    Services Offered
                  </p>
                </div>
                <div className="rounded-2xl bg-blue-50 p-5">
                  <p className="text-3xl font-bold text-blue-800">100%</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    Transparent Process
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </Container>
      </section>

      {/* Contact Section */}
      <section className={SECTION_PADDING}>
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Get In Touch
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600">
              Visit us or call for any query. We are happy to help.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            <a
              href={`tel:${CSC_CONTACT.phone}`}
              className="group flex items-center gap-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-200"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 border border-blue-200 text-blue-800 transition-all duration-300 group-hover:bg-blue-200">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </span>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-600">Phone</p>
                <p className="text-xl font-bold text-slate-900">
                  {CSC_CONTACT.phones.join(", ")}
                </p>
              </div>
            </a>
            <a
              href={`mailto:${CSC_CONTACT.email}`}
              className="group flex items-center gap-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-200"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 border border-blue-200 text-blue-800 transition-all duration-300 group-hover:bg-blue-200">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-600">Email</p>
                <p className="text-xl font-bold text-slate-900">
                  {CSC_CONTACT.email}
                </p>
              </div>
            </a>
            <div className="flex items-center gap-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 border border-blue-200 text-blue-800">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </span>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-600">Address</p>
                <p className="text-xl font-bold text-slate-900">
                  {CSC_CONTACT.address}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
