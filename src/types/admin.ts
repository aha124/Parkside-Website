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
export type PageKey = "home" | "about" | "join" | "media" | "donate" | "events" | "gear" | "contact" | "leadership";

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
  // "Our Choruses" section card images on home page
  chorusCardImages?: {
    harmony?: string;
    melody?: string;
    voices?: string;
  };
  // About page "Our Story" section images per chorus
  aboutStoryImages?: {
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

// ============ PAGE CONTENT TYPES ============

// Editable text content for each page - flexible key-value structure
export interface PageContent {
  // Common fields for all pages
  heroTitle?: string;
  heroSubtitle?: string;

  // Page-specific fields stored as key-value
  [key: string]: string | undefined;
}

// All page content organized by page key
export type AllPageContent = Record<PageKey, PageContent>;

// ============ LEADERSHIP TYPES ============

export type LeadershipCategory = "musicLeadership" | "boardMember" | "boardAtLarge";
export type ChorusAffiliation = "harmony" | "melody" | "both";

export interface LeadershipMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  category: LeadershipCategory;
  chorusAffiliation?: ChorusAffiliation;
  order: number; // For drag-and-drop reordering within category
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

// Default content for each page (used as fallback and for admin UI labels)
export const PAGE_CONTENT_SCHEMA: Record<PageKey, { fields: Array<{ key: string; label: string; type: "text" | "textarea" }> }> = {
  home: {
    fields: [
      // Hero slide descriptions per chorus
      { key: "heroDescription_harmony", label: "Harmony Hero Description", type: "textarea" },
      { key: "heroDescription_melody", label: "Melody Hero Description", type: "textarea" },
      { key: "heroDescription_voices", label: "Voices Hero Description", type: "textarea" },
      // Our Choruses section card descriptions
      { key: "chorusCard_harmony", label: "Harmony Card Description", type: "textarea" },
      { key: "chorusCard_melody", label: "Melody Card Description", type: "textarea" },
      { key: "chorusCard_voices", label: "Voices Card Description", type: "textarea" },
    ],
  },
  about: {
    fields: [
      // Per-chorus "Our Story" content (single text block each)
      { key: "story_harmony", label: "Harmony - Our Story", type: "textarea" },
      { key: "story_melody", label: "Melody - Our Story", type: "textarea" },
      { key: "story_voices", label: "Voices - Our Story", type: "textarea" },
    ],
  },
  // Leadership: Only member management, no editable page content
  leadership: { fields: [] },
  // Join: Banner images only, content is static in code
  join: { fields: [] },
  // Events: Banner images only, content is dynamic (events list)
  events: { fields: [] },
  // Media: Banner images only, content managed separately
  media: { fields: [] },
  // Contact: Banner images only, form is static
  contact: { fields: [] },
  // Donate: Banner images only, content is static
  donate: { fields: [] },
  // Gear: Banner images only, shop content managed separately
  gear: { fields: [] },
};
