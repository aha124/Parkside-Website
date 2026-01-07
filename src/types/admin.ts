// Admin content types

// Chorus type used across all content
export type ChorusTag = "harmony" | "melody" | "voices";

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  content?: string;
  imageUrl: string;
  url?: string;
  chorus: ChorusTag;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  imageUrl: string;
  chorus: ChorusTag;
  url?: string;
  // Admin override fields
  isManualOverride?: boolean;
  isHidden?: boolean;
  originalId?: string; // Links to scraped event if this is an override
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface VideoItem {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  year: number;
  chorus: ChorusTag;
  competition?: string;
  placement?: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface SiteImage {
  id: string;
  name: string;
  url: string;
  category: "slideshow" | "hero" | "banner" | "progression" | "other";
  chorus: ChorusTag;
  alt?: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface AdminUser {
  email: string;
  name?: string;
  role: "admin" | "superadmin";
  addedAt: string;
  addedBy?: string;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// YouTube oEmbed response
export interface YouTubeOEmbed {
  title: string;
  author_name: string;
  author_url: string;
  type: string;
  height: number;
  width: number;
  version: string;
  provider_name: string;
  provider_url: string;
  thumbnail_height: number;
  thumbnail_width: number;
  thumbnail_url: string;
  html: string;
}

// Site branding settings - per page, per chorus
export type ChorusKey = "harmony" | "melody" | "voices";

// Banner URLs for each chorus selection
export interface PageBanners {
  harmony?: string;
  melody?: string;
  voices?: string;
}

// All pages that can have custom banners
export type PageKey = "home" | "about" | "join" | "media" | "donate" | "events" | "gear" | "contact";

export interface SiteSettings {
  // Logos per chorus
  logos: {
    harmony?: string;
    melody?: string;
    voices?: string;
  };
  // Page banners - each page can have different banner per chorus
  pageBanners: Record<PageKey, PageBanners>;
  // Splash page backgrounds per chorus (mobile carousel & desktop split)
  splashBackgrounds?: {
    harmony?: string;
    melody?: string;
    voices?: string;
  };
  // Hero slideshow first slide background per chorus
  heroSlideBackground?: {
    harmony?: string;
    melody?: string;
    voices?: string;
  };
  updatedAt?: string;
  updatedBy?: string;
}

// Legacy type for backwards compatibility
export interface ChorusBranding {
  logoUrl?: string;
  bannerUrl?: string;
  heroImageUrl?: string;
}
