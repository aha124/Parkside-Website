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
  url?: string;    // scraped articles link out to parksideharmony.org
  slug?: string;   // stable URL segment for articles hosted here (/news/<slug>)
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

// ============ AD CAMPAIGN TYPES ============

export interface AdCampaignPricingTier {
  id: string;          // uuid, for stable React keys when editing
  name: string;        // e.g. "Full Page"
  spec: string;        // e.g. "8.5×11, full color"
  price: number;       // stored as number, displayed as currency
  description?: string;
  paypalButtonId?: string; // PayPal hosted button ID for this tier
}

export interface AdCampaign {
  id: string;
  slug: string;                  // URL-safe, e.g. "forum-2026"
  title: string;                 // e.g. "Advertise in the program for An Afternoon at The Forum"
  eventContext?: string;         // short blurb: "June 13, 2026 · The Forum Auditorium · Harrisburg, PA"
  heroImageUrl: string;
  pitch: string;                 // single textarea, paragraphs separated by blank lines
  pricingTiers: AdCampaignPricingTier[];
  paypalDropdownButtonId?: string;   // PayPal hosted button ID for single-button-with-dropdown mode
  paypalDropdownOptionName?: string; // PayPal "option name" (the on0 value), e.g. "2026 Program Ad"
  orderFormUrl?: string;         // Google Form link
  pastProgramUrl?: string;       // FlipHTML5 link to last year's program
  deadline?: string;             // human-readable, e.g. "May 15, 2026"
  contactName?: string;
  contactEmail?: string;
  isActive: boolean;             // controls public URL rendering
  isFeaturedOnHomepage: boolean; // optional homepage link
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

// ============ FEATURED BANNER TYPES ============

/**
 * A promotional banner on the homepage, e.g. an upcoming concert.
 *
 * Replaces the old hardcoded FeaturedEventBanner: banners are now created and
 * retired from the admin panel. `endDate` lets a banner retire itself once the
 * show has passed, so a stale promo can't outlive its event unnoticed.
 */
export interface FeaturedBanner {
  id: string;
  leadIn?: string;      // italic lead-in, e.g. "An Afternoon at"
  headline: string;     // main headline, e.g. "The Forum"
  subline?: string;     // e.g. "June 13, 2026 · 3:00 PM · Harrisburg, PA"
  imageUrl: string;     // background image
  logoUrl?: string;     // optional logo shown to the left of the text
  linkUrl: string;      // internal path ("/ParksideAtTheForum") or https:// URL
  linkLabel?: string;   // call-to-action text, defaults to "Learn More"
  isActive: boolean;    // master on/off switch
  startDate?: string;   // "YYYY-MM-DD"; blank = visible as soon as it's active
  endDate?: string;     // "YYYY-MM-DD" inclusive; blank = until switched off
  priority: number;     // when several are live, the highest priority renders
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
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
  // Gear page store images
  gearStoreImages?: {
    etown?: string; // eTown Sporting Goods (Chipply)
    cafepress?: string; // CafePress
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
export const PAGE_CONTENT_SCHEMA: Record<PageKey, { fields: Array<{ key: string; label: string; type: "text" | "textarea"; section?: string; help?: string }> }> = {
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
  join: {
    fields: [
      // Hero — per chorus
      { key: "heroTitle_harmony", label: "Harmony - Hero Title", type: "text", section: "Hero" },
      { key: "heroSubtitle_harmony", label: "Harmony - Hero Subtitle", type: "textarea", section: "Hero" },
      { key: "heroTitle_melody", label: "Melody - Hero Title", type: "text", section: "Hero" },
      { key: "heroSubtitle_melody", label: "Melody - Hero Subtitle", type: "textarea", section: "Hero" },
      { key: "heroTitle_voices", label: "Voices - Hero Title", type: "text", section: "Hero" },
      { key: "heroSubtitle_voices", label: "Voices - Hero Subtitle", type: "textarea", section: "Hero" },
      // Audition process
      { key: "auditionTitle", label: "Section Heading", type: "text", section: "Audition Process" },
      { key: "auditionIntro_harmony", label: "Harmony - Intro Text", type: "textarea", section: "Audition Process" },
      { key: "auditionIntro_melody", label: "Melody - Intro Text", type: "textarea", section: "Audition Process" },
      { key: "auditionIntro_voices", label: "Voices - Intro Text", type: "textarea", section: "Audition Process" },
      { key: "step1Title", label: "Step 1 - Title", type: "text", section: "Audition Process" },
      { key: "step1Text", label: "Step 1 - Description", type: "textarea", section: "Audition Process" },
      { key: "step2Title", label: "Step 2 - Title", type: "text", section: "Audition Process" },
      { key: "step2Text", label: "Step 2 - Description", type: "textarea", section: "Audition Process" },
      { key: "step3Title", label: "Step 3 - Title", type: "text", section: "Audition Process" },
      { key: "step3Text", label: "Step 3 - Description", type: "textarea", section: "Audition Process" },
      // Rehearsal / voice part details (only shown for Harmony and Melody)
      {
        key: "voiceType_harmony",
        label: "Harmony - Voice Parts",
        type: "text",
        section: "Rehearsals & Voice Parts",
      },
      {
        key: "rehearsal_harmony",
        label: "Harmony - Rehearsal Times",
        type: "text",
        section: "Rehearsals & Voice Parts",
      },
      {
        key: "voiceType_melody",
        label: "Melody - Voice Parts",
        type: "text",
        section: "Rehearsals & Voice Parts",
      },
      {
        key: "rehearsal_melody",
        label: "Melody - Rehearsal Times",
        type: "text",
        section: "Rehearsals & Voice Parts",
      },
      // Contact / call to action
      { key: "ctaTitle", label: "Section Heading", type: "text", section: "Ready to Take the Next Step" },
      { key: "ctaText_harmony", label: "Harmony - Contact Text", type: "textarea", section: "Ready to Take the Next Step" },
      { key: "ctaText_melody", label: "Melody - Contact Text", type: "textarea", section: "Ready to Take the Next Step" },
      { key: "ctaText_voices", label: "Voices - Contact Text", type: "textarea", section: "Ready to Take the Next Step" },
      { key: "contactEmail", label: "Audition Email Address", type: "text", section: "Ready to Take the Next Step" },
      { key: "eventsButtonText", label: "Events Button Label", type: "text", section: "Ready to Take the Next Step" },
      { key: "eventsButtonSubtext", label: "Events Button Caption", type: "text", section: "Ready to Take the Next Step" },
    ],
  },
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
