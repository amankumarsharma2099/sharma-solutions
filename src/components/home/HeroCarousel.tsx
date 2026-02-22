"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  {
    id: 1,
    title: "Sharma Solutions",
    tagline: "Your Trusted CSC Service Center",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=80",
    alt: "CSC service center",
  },
  {
    id: 2,
    title: "Sharma Solutions",
    tagline: "Your Trusted CSC Service Center",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
    alt: "Customer service",
  },
  {
    id: 3,
    title: "Sharma Solutions",
    tagline: "Your Trusted CSC Service Center",
    image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=1200&q=80",
    alt: "Office workspace",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-[70vw] max-h-[420px] min-h-[280px] w-full overflow-hidden rounded-b-2xl bg-slate-200 sm:min-h-[320px]">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "z-10 opacity-100" : "z-0 opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority={i === 0}
            unoptimized
          />
          <div className="absolute inset-0 bg-slate-900/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
            <h1 className="text-3xl font-bold drop-shadow-lg sm:text-4xl md:text-5xl">
              {slide.title}
            </h1>
            <p className="mt-2 text-lg drop-shadow sm:text-xl md:text-2xl">
              {slide.tagline}
            </p>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
