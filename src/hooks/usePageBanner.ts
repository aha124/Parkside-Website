"use client";

import { useState, useEffect } from "react";
import { useChorus } from "@/lib/chorus-context";
import type { PageKey, SiteSettings } from "@/types/admin";

// Default banners for each page (fallbacks)
const defaultBanners: Record<PageKey, string> = {
  home: "/images/slideshow/slide1-main.jpg",
  about: "/images/placeholder-hero.jpg",
  join: "/images/join-hero.jpg",
  media: "/images/placeholder-hero.jpg",
  donate: "/images/slideshow/slide2-donate.jpg",
  events: "/images/slideshow/slide3-events.jpg",
  gear: "/images/slideshow/slide4-shop.jpg",
  contact: "/images/slideshow/slide5-contact.jpg",
};

// Pages that should have the SAME banner regardless of chorus selection
const sharedBannerPages: PageKey[] = ["donate", "gear"];

export function usePageBanner(page: PageKey): string {
  const { chorus } = useChorus();
  const [banner, setBanner] = useState<string>(defaultBanners[page]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Fetch site settings once
  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/admin/site-settings");
        const data = await response.json();
        if (data.success) {
          setSettings(data.data);
        }
      } catch (error) {
        console.error("Error fetching site settings:", error);
      }
    }
    fetchSettings();
  }, []);

  // Update banner when settings or chorus changes
  useEffect(() => {
    if (!settings?.pageBanners?.[page]) {
      setBanner(defaultBanners[page]);
      return;
    }

    const pageBanners = settings.pageBanners[page];

    // For shared pages (donate, gear), always use 'voices' banner
    if (sharedBannerPages.includes(page)) {
      setBanner(pageBanners.voices || defaultBanners[page]);
      return;
    }

    // Otherwise, get the banner for the current chorus
    const chorusBanner = pageBanners[chorus];
    setBanner(chorusBanner || pageBanners.voices || defaultBanners[page]);
  }, [settings, chorus, page]);

  return banner;
}

// For server components or when you need all banners
export async function getPageBanners(): Promise<SiteSettings | null> {
  try {
    const response = await fetch("/api/admin/site-settings", {
      cache: "no-store",
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }
}
