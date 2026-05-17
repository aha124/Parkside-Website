"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ScrollAnimation from "@/components/ui/ScrollAnimation";

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Montserrat:wght@300;400;500;600&display=swap";

interface FeaturedCampaign {
  id: string;
  slug: string;
  title: string;
  eventContext?: string;
  updatedAt: string;
}

function useGoogleFonts() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_URL}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_URL;
    document.head.appendChild(link);
  }, []);
}

export default function FeaturedAdCampaignBanner() {
  useGoogleFonts();
  const [campaign, setCampaign] = useState<FeaturedCampaign | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/ad-campaigns?featured=true");
        if (!response.ok) return;
        const { data } = (await response.json()) as { data: FeaturedCampaign[] };
        if (cancelled || !Array.isArray(data) || data.length === 0) return;
        const sorted = [...data].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setCampaign(sorted[0]);
      } catch {
        // Silent fail — homepage simply renders nothing if fetch fails.
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!campaign) return null;

  return (
    <section className="py-8 sm:py-10">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <Link
            href={`/advertise/${campaign.slug}`}
            className="group block relative overflow-hidden rounded-2xl border"
            style={{
              backgroundColor: "#0c0c18",
              borderColor: "rgba(201,168,98,0.4)",
            }}
          >
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 px-6 sm:px-10 py-6 sm:py-8">
              <div className="text-center sm:text-left flex-1">
                <p
                  className="font-['Montserrat',sans-serif] text-[0.65rem] sm:text-xs tracking-[0.25em] uppercase mb-2"
                  style={{ color: "#c9a862" }}
                >
                  Sponsorship Opportunity
                </p>
                <h3
                  className="font-['Cormorant_Garamond',serif] text-xl sm:text-2xl md:text-3xl font-medium"
                  style={{ color: "#f0ebe0" }}
                >
                  {campaign.title}
                </h3>
                {campaign.eventContext && (
                  <p
                    className="font-['Montserrat',sans-serif] text-xs sm:text-sm mt-1"
                    style={{ color: "#c0b898" }}
                  >
                    {campaign.eventContext}
                  </p>
                )}
              </div>
              <div
                className="shrink-0 font-['Montserrat',sans-serif] text-xs sm:text-sm tracking-[0.15em] uppercase flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-1"
                style={{ color: "#c9a862" }}
              >
                <span>Advertise with us</span>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
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
