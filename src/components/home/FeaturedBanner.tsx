"use client";

import ScrollAnimation from "@/components/ui/ScrollAnimation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─── Typography ────────────────────────────────────────────────────────────────
// Fonts loaded at runtime via Google Fonts CSS link injection.
const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Montserrat:wght@300;400;500;600&display=swap";

interface BannerData {
  id: string;
  leadIn?: string;
  headline: string;
  subline?: string;
  imageUrl: string;
  logoUrl?: string;
  linkUrl: string;
  linkLabel?: string;
}

function useGoogleFonts(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    if (document.querySelector(`link[href="${FONT_URL}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_URL;
    document.head.appendChild(link);
  }, [enabled]);
}

/**
 * Promotional banner for the current featured event, managed from
 * Admin → Homepage Banners.
 *
 * Renders nothing unless a banner is live, so the homepage closes up on its own
 * once a show has passed and its end date lapses.
 */
export default function FeaturedBanner() {
  const [banner, setBanner] = useState<BannerData | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/featured-banners");
        if (!response.ok) return;
        const { data } = (await response.json()) as { data: BannerData | null };
        if (cancelled || !data) return;
        setBanner(data);
      } catch {
        // Silent fail — homepage simply renders nothing if the fetch fails.
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useGoogleFonts(Boolean(banner));

  if (!banner) return null;

  const isExternal = !banner.linkUrl.startsWith("/");
  const linkLabel = banner.linkLabel?.trim() || "Learn More";

  const content = (
    <>
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={banner.imageUrl}
          alt=""
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
        {banner.logoUrl && (
          <>
            <div className="shrink-0">
              <Image
                src={banner.logoUrl}
                alt=""
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
          </>
        )}

        {/* Text */}
        <div className="text-center sm:text-left flex-1">
          <h3
            className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl md:text-4xl font-medium"
            style={{
              color: "#f0ebe0",
              textShadow: "0 2px 16px rgba(0,0,0,0.5)",
            }}
          >
            {banner.leadIn && (
              <>
                <span className="italic font-light">{banner.leadIn}</span>{" "}
              </>
            )}
            {banner.headline}
          </h3>
          {banner.subline && (
            <p
              className="font-['Montserrat',sans-serif] text-xs sm:text-sm tracking-[0.2em] uppercase mt-2"
              style={{ color: "#c9a862" }}
            >
              {banner.subline}
            </p>
          )}
        </div>

        {/* Arrow indicator */}
        <div
          className="shrink-0 font-['Montserrat',sans-serif] text-xs sm:text-sm tracking-[0.15em] uppercase flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-1"
          style={{ color: "#c9a862" }}
        >
          <span className="hidden md:inline">{linkLabel}</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </>
  );

  const className = "group block relative overflow-hidden rounded-2xl";
  const style = { backgroundColor: "#0c0c18" };

  return (
    <section className="py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          {isExternal ? (
            <a
              href={banner.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
              style={style}
            >
              {content}
            </a>
          ) : (
            <Link href={banner.linkUrl} className={className} style={style}>
              {content}
            </Link>
          )}
        </ScrollAnimation>
      </div>
    </section>
  );
}
