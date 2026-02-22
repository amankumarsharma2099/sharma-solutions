"use client";

const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5973.965793!2d85.9445707!3d22.7100641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f5f3f89b913cc1%3A0x3169d97f3c00ed31!2sSHARMA+PRAGYA+KENDRA+AADHAR+KENDRA+BANKING+KENDRA!5e0!3m2!1sen!2sin!4v1708483471748";

export function GoogleMapEmbed() {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center text-slate-900">
        Our Location
      </h2>
      <div className="overflow-hidden rounded-2xl shadow-lg border border-gray-200">
        <iframe
          src={MAP_EMBED_SRC}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Sharma Solutions location on Google Maps"
          className="w-full h-56 sm:h-64 lg:h-80 rounded-2xl border-0"
        />
      </div>
    </section>
  );
}
