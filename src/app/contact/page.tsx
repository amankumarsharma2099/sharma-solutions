import type { Metadata } from "next";
import { CSC_CONTACT } from "@/data/services";
import { Card, CardContent } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { GoogleMapEmbed } from "@/components/GoogleMapEmbed";

export const metadata: Metadata = {
  title: "Contact Us | Sharma Solutions",
  description: `Reach Sharma Solutions CSC at ${CSC_CONTACT.phones.join(" or ")} or ${CSC_CONTACT.email}. Visit us at ${CSC_CONTACT.address}.`,
};

export default function ContactPage() {
  return (
    <Container className="py-12 md:py-16">
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          Contact Us
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Reach out for any queries or visit our center for in-person service.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <Card className="transition-all duration-300 hover:shadow-2xl">
          <CardContent className="py-8">
            <div className="flex items-start gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-800 border border-blue-200">
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
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Phone</h3>
                <div className="mt-2 space-y-1">
                  {CSC_CONTACT.phones.map((num) => (
                    <a
                      key={num}
                      href={`tel:${num}`}
                      className="block text-blue-700 font-medium transition-colors hover:text-blue-800 hover:underline"
                    >
                      {num}
                    </a>
                  ))}
                </div>
                <p className="mt-2 text-sm text-slate-600">CSC Contact Numbers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-2xl">
          <CardContent className="py-8">
            <div className="flex items-start gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-800 border border-blue-200">
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
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Email</h3>
                <a
                  href={`mailto:${CSC_CONTACT.email}`}
                  className="mt-2 block text-blue-700 font-medium transition-colors hover:text-blue-800 hover:underline"
                >
                  {CSC_CONTACT.email}
                </a>
                <p className="mt-2 text-sm text-slate-600">
                  We respond within 24 hours
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1 transition-all duration-300 hover:shadow-2xl">
          <CardContent className="py-8">
            <div className="flex items-start gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-800 border border-blue-200">
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
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Address</h3>
                <p className="mt-2 text-slate-600">{CSC_CONTACT.address}</p>
                <p className="mt-2 text-sm text-slate-600">
                  Visit during working hours
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-10 transition-all duration-300 hover:shadow-xl">
        <CardContent className="py-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Working Hours
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Monday – Saturday: 9:00 AM – 6:00 PM. Closed on public holidays.
          </p>
        </CardContent>
      </Card>

      <GoogleMapEmbed />
    </Container>
  );
}
