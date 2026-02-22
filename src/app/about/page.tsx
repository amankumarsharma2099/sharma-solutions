import { Card, CardContent } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export default function AboutPage() {
  return (
    <Container className="py-12 md:py-16">
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          About Us
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Your trusted Common Service Centre in the heart of the community.
        </p>
      </div>

      <div className="mt-10 space-y-6">
        <Card>
          <CardContent className="py-8">
            <h2 className="text-2xl font-semibold text-slate-900">
              Who We Are
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Sharma Solutions is a registered Common Service Centre (CSC) that
              bridges the gap between government services and citizens. We
              provide a single-window access point for a variety of essential
              services, making it convenient for you to complete official work
              without visiting multiple offices.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-8">
            <h2 className="text-2xl font-semibold text-slate-900">
              Our Mission
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              To deliver government and utility services in a transparent,
              efficient, and citizen-friendly manner. We aim to empower every
              individual with easy access to Aadhaar, voter ID, insurance,
              banking, and many more services under one roof.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-8">
            <h2 className="text-2xl font-semibold text-slate-900">
              Why Choose Us
            </h2>
            <ul className="mt-4 space-y-3 text-lg text-slate-600">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                Experienced and trained staff
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                Quick turnaround for most services
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                Transparent pricing and process
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                Convenient location and flexible timings
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                Official CSC authorization and compliance
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
