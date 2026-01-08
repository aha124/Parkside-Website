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
      { key: "heroTitle", label: "Hero Title", type: "text" },
      { key: "heroSubtitle", label: "Hero Subtitle", type: "textarea" },
      { key: "historyTitle", label: "History Section Title", type: "text" },
      { key: "historyContent", label: "History Content", type: "textarea" },
    ],
  },
  leadership: {
    fields: [
      { key: "heroTitle", label: "Hero Title", type: "text" },
      { key: "heroSubtitle", label: "Hero Subtitle", type: "textarea" },
      { key: "musicLeadershipTitle", label: "Music Leadership Section Title", type: "text" },
      { key: "boardMembersTitle", label: "Board Members Section Title", type: "text" },
      { key: "boardAtLargeTitle", label: "Board at Large Section Title", type: "text" },
      { key: "getInvolvedTitle", label: "Get Involved Section Title", type: "text" },
      { key: "getInvolvedText", label: "Get Involved Text", type: "textarea" },
      { key: "getInvolvedButtonText", label: "Get Involved Button Text", type: "text" },
    ],
  },
  join: {
    fields: [
      { key: "heroTitle", label: "Hero Title", type: "text" },
      { key: "heroSubtitle", label: "Hero Subtitle", type: "textarea" },
      { key: "benefitsTitle", label: "Benefits Section Title", type: "text" },
      { key: "ctaButtonText", label: "CTA Button Text", type: "text" },
    ],
  },
  events: {
    fields: [
      { key: "heroTitle", label: "Hero Title", type: "text" },
      { key: "heroSubtitle", label: "Hero Subtitle", type: "textarea" },
    ],
  },
  media: {
    fields: [
      { key: "heroTitle", label: "Hero Title", type: "text" },
      { key: "heroSubtitle", label: "Hero Subtitle", type: "textarea" },
      { key: "videosTitle", label: "Videos Section Title", type: "text" },
      { key: "photosTitle", label: "Photos Section Title", type: "text" },
    ],
  },
  contact: {
    fields: [
      { key: "heroTitle", label: "Hero Title", type: "text" },
      { key: "heroSubtitle", label: "Hero Subtitle", type: "textarea" },
      { key: "formTitle", label: "Form Title", type: "text" },
      { key: "formIntro", label: "Form Introduction", type: "textarea" },
    ],
  },
  donate: {
    fields: [
      { key: "heroTitle", label: "Hero Title", type: "text" },
      { key: "heroSubtitle", label: "Hero Subtitle", type: "textarea" },
      { key: "mainMessage", label: "Main Message", type: "textarea" },
      { key: "ctaButtonText", label: "Donate Button Text", type: "text" },
    ],
  },
  gear: {
    fields: [
      { key: "heroTitle", label: "Hero Title", type: "text" },
      { key: "heroSubtitle", label: "Hero Subtitle", type: "textarea" },
    ],
  },
};
