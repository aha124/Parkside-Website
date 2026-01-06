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
