"use client";

import ScrollAnimation from "@/components/ui/ScrollAnimation";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

// ─── Typography (matches the event page) ───────────────────────────────────────
// Fonts loaded at runtime via Google Fonts CSS link injection.
const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Montserrat:wght@300;400;500;600&display=swap";

function useGoogleFonts() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_URL}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_URL;
    document.head.appendChild(link);
  }, []);
}

/**
 * Featured event banner for the homepage promoting
 * "An Afternoon at The Forum" — June 13, 2026.
 *
 * Self-contained component for easy removal after the event.
 */
export default function FeaturedEventBanner() {
  useGoogleFonts();

  return (
    <section className="py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <Link
            href="/ParksideAtTheForum"
            className="group block relative overflow-hidden rounded-2xl"
            style={{ backgroundColor: "#0c0c18" }}
          >
            {/* Background image */}
            <div className="absolute inset-0">
              <Image
                src="/images/events/forum-interior.png"
                alt="The Forum Auditorium interior"
                fill
                className="object-cover opacity-70 group-hover:opacity-80 transition-opacity duration-500 scale-105 group-hover:scale-100"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>

            {/* Dark gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(12,12,24,0.7) 0%, rgba(12,12,24,0.45) 50%, rgba(12,12,24,0.3) 100%)",
              }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 px-6 sm:px-10 md:px-14 py-10 sm:py-12 md:py-14">
              {/* Logo */}
              <div className="shrink-0">
                <Image
                  src="/images/events/parkside-voices-logo-gold.png"
                  alt="Parkside Voices"
                  width={120}
                  height={80}
                  className="h-[60px] sm:h-[70px] md:h-[80px] w-auto"
                />
              </div>

              {/* Vertical divider (desktop) */}
              <div
                className="hidden sm:block w-px h-20 shrink-0"
                style={{ backgroundColor: "rgba(201,168,98,0.4)" }}
              />

              {/* Text */}
              <div className="text-center sm:text-left flex-1">
                <h3
                  className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl md:text-4xl font-medium"
                  style={{
                    color: "#f0ebe0",
                    textShadow: "0 2px 16px rgba(0,0,0,0.5)",
                  }}
                >
                  <span className="italic font-light">An Afternoon at</span>{" "}
                  The Forum
                </h3>
                <p
                  className="font-['Montserrat',sans-serif] text-xs sm:text-sm tracking-[0.2em] uppercase mt-2"
                  style={{ color: "#c9a862" }}
                >
                  June 13, 2026 &middot; 3:00 PM &middot; Harrisburg, PA
                </p>
              </div>

              {/* Arrow indicator */}
              <div
                className="shrink-0 font-['Montserrat',sans-serif] text-xs sm:text-sm tracking-[0.15em] uppercase flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-1"
                style={{ color: "#c9a862" }}
              >
                <span className="hidden md:inline">Learn More</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </ScrollAnimation>
      </div>
    </section>
  );
}
