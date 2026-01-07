import { kv } from "@vercel/kv";
import { v4 as uuidv4 } from "uuid";
import type { NewsItem, EventItem, VideoItem, SiteImage, AdminUser, SiteSettings } from "@/types/admin";

// KV Keys
const KEYS = {
  NEWS: "admin:news",
  EVENT_OVERRIDES: "admin:event-overrides",
  VIDEOS: "admin:videos",
  IMAGES: "admin:images",
  ADMIN_USERS: "admin:users",
  SITE_SETTINGS: "admin:site-settings",
} as const;

// ============ NEWS MANAGEMENT ============

export async function getNews(): Promise<NewsItem[]> {
  try {
    const news = await kv.get<NewsItem[]>(KEYS.NEWS);
    return news || [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export async function createNews(data: Omit<NewsItem, "id" | "createdAt" | "updatedAt">): Promise<NewsItem> {
  const news = await getNews();
  const newItem: NewsItem = {
    ...data,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await kv.set(KEYS.NEWS, [newItem, ...news]);
  return newItem;
}

export async function updateNews(id: string, data: Partial<NewsItem>): Promise<NewsItem | null> {
  const news = await getNews();
  const index = news.findIndex(item => item.id === id);
  if (index === -1) return null;

  news[index] = {
    ...news[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await kv.set(KEYS.NEWS, news);
  return news[index];
}

export async function deleteNews(id: string): Promise<boolean> {
  const news = await getNews();
  const filtered = news.filter(item => item.id !== id);
  if (filtered.length === news.length) return false;
  await kv.set(KEYS.NEWS, filtered);
  return true;
}

// ============ EVENT OVERRIDES MANAGEMENT ============

export async function getEventOverrides(): Promise<EventItem[]> {
  try {
    const overrides = await kv.get<EventItem[]>(KEYS.EVENT_OVERRIDES);
    return overrides || [];
  } catch (error) {
    console.error("Error fetching event overrides:", error);
    return [];
  }
}

export async function createEventOverride(data: Omit<EventItem, "id" | "createdAt" | "updatedAt" | "isManualOverride">): Promise<EventItem> {
  const overrides = await getEventOverrides();
  const newItem: EventItem = {
    ...data,
    id: uuidv4(),
    isManualOverride: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await kv.set(KEYS.EVENT_OVERRIDES, [...overrides, newItem]);
  return newItem;
}

export async function updateEventOverride(id: string, data: Partial<EventItem>): Promise<EventItem | null> {
  const overrides = await getEventOverrides();
  const index = overrides.findIndex(item => item.id === id);
  if (index === -1) return null;

  overrides[index] = {
    ...overrides[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await kv.set(KEYS.EVENT_OVERRIDES, overrides);
  return overrides[index];
}

export async function deleteEventOverride(id: string): Promise<boolean> {
  const overrides = await getEventOverrides();
  const filtered = overrides.filter(item => item.id !== id);
  if (filtered.length === overrides.length) return false;
  await kv.set(KEYS.EVENT_OVERRIDES, filtered);
  return true;
}

// Hide a scraped event by its original ID
export async function hideScrapedEvent(originalId: string, createdBy?: string): Promise<EventItem> {
  const overrides = await getEventOverrides();
  const hideOverride: EventItem = {
    id: uuidv4(),
    originalId,
    isHidden: true,
    isManualOverride: true,
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    location: "",
    imageUrl: "",
    chorus: "voices",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy,
  };
  await kv.set(KEYS.EVENT_OVERRIDES, [...overrides, hideOverride]);
  return hideOverride;
}

// ============ VIDEO MANAGEMENT ============

export async function getVideos(): Promise<VideoItem[]> {
  try {
    const videos = await kv.get<VideoItem[]>(KEYS.VIDEOS);
    return videos || [];
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}

export async function createVideo(data: Omit<VideoItem, "id" | "createdAt" | "updatedAt">): Promise<VideoItem> {
  const videos = await getVideos();
  const newItem: VideoItem = {
    ...data,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await kv.set(KEYS.VIDEOS, [newItem, ...videos]);
  return newItem;
}

export async function updateVideo(id: string, data: Partial<VideoItem>): Promise<VideoItem | null> {
  const videos = await getVideos();
  const index = videos.findIndex(item => item.id === id);
  if (index === -1) return null;

  videos[index] = {
    ...videos[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await kv.set(KEYS.VIDEOS, videos);
  return videos[index];
}

export async function deleteVideo(id: string): Promise<boolean> {
  const videos = await getVideos();
  const filtered = videos.filter(item => item.id !== id);
  if (filtered.length === videos.length) return false;
  await kv.set(KEYS.VIDEOS, filtered);
  return true;
}

// ============ IMAGE MANAGEMENT ============

export async function getImages(): Promise<SiteImage[]> {
  try {
    const images = await kv.get<SiteImage[]>(KEYS.IMAGES);
    return images || [];
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
}

export async function createImage(data: Omit<SiteImage, "id" | "createdAt" | "updatedAt">): Promise<SiteImage> {
  const images = await getImages();
  const newItem: SiteImage = {
    ...data,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await kv.set(KEYS.IMAGES, [...images, newItem]);
  return newItem;
}

export async function updateImage(id: string, data: Partial<SiteImage>): Promise<SiteImage | null> {
  const images = await getImages();
  const index = images.findIndex(item => item.id === id);
  if (index === -1) return null;

  images[index] = {
    ...images[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await kv.set(KEYS.IMAGES, images);
  return images[index];
}

export async function deleteImage(id: string): Promise<boolean> {
  const images = await getImages();
  const filtered = images.filter(item => item.id !== id);
  if (filtered.length === images.length) return false;
  await kv.set(KEYS.IMAGES, filtered);
  return true;
}

// ============ ADMIN USER MANAGEMENT ============

export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const users = await kv.get<AdminUser[]>(KEYS.ADMIN_USERS);
    return users || [];
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return [];
  }
}

export async function addAdminUser(email: string, addedBy?: string, role: "admin" | "superadmin" = "admin"): Promise<AdminUser> {
  const users = await getAdminUsers();
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) return existing;

  const newUser: AdminUser = {
    email: email.toLowerCase(),
    role,
    addedAt: new Date().toISOString(),
    addedBy,
  };
  await kv.set(KEYS.ADMIN_USERS, [...users, newUser]);

  // Also update the admin emails list for auth
  const { addAdminEmail } = await import("./auth");
  await addAdminEmail(email);

  return newUser;
}

export async function removeAdminUser(email: string): Promise<boolean> {
  const users = await getAdminUsers();
  const filtered = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());
  if (filtered.length === users.length) return false;
  await kv.set(KEYS.ADMIN_USERS, filtered);

  // Also remove from admin emails list for auth
  const { removeAdminEmail } = await import("./auth");
  await removeAdminEmail(email);

  return true;
}

export async function updateAdminUser(email: string, data: Partial<AdminUser>): Promise<AdminUser | null> {
  const users = await getAdminUsers();
  const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...data,
  };
  await kv.set(KEYS.ADMIN_USERS, users);
  return users[index];
}

// ============ YOUTUBE METADATA ============

export async function fetchYouTubeMetadata(videoIdOrUrl: string): Promise<{
  id: string;
  title: string;
  thumbnailUrl: string;
} | null> {
  // Extract video ID from URL if necessary
  let videoId = videoIdOrUrl;

  // Handle various YouTube URL formats
  const urlPatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of urlPatterns) {
    const match = videoIdOrUrl.match(pattern);
    if (match) {
      videoId = match[1];
      break;
    }
  }

  try {
    // Use YouTube oEmbed API (no API key required)
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );

    if (!response.ok) return null;

    const data = await response.json();

    return {
      id: videoId,
      title: data.title,
      thumbnailUrl: data.thumbnail_url,
    };
  } catch (error) {
    console.error("Error fetching YouTube metadata:", error);
    return null;
  }
}

// ============ SITE SETTINGS MANAGEMENT ============

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  logos: {
    harmony: "/images/parkside-logo.png",
    melody: "/images/parkside-logo.png",
    voices: "/images/parkside-logo.png",
  },
  pageBanners: {
    home: {
      harmony: "/images/harmony-bg.jpg",
      melody: "/images/melody-bg.jpg",
      voices: "/images/slideshow/slide1-main.jpg",
    },
    about: {
      harmony: "/images/harmony-performance.jpg",
      melody: "/images/melody-performance.jpg",
      voices: "/images/placeholder-hero.jpg",
    },
    join: {
      harmony: "/images/harmony-bg.jpg",
      melody: "/images/melody-bg.jpg",
      voices: "/images/join-hero.jpg",
    },
    media: {
      harmony: "/images/harmony-performance.jpg",
      melody: "/images/melody-performance.jpg",
      voices: "/images/placeholder-hero.jpg",
    },
    donate: {
      harmony: "/images/harmony-bg.jpg",
      melody: "/images/melody-bg.jpg",
      voices: "/images/slideshow/slide2-donate.jpg",
    },
    events: {
      harmony: "/images/harmony-performance.jpg",
      melody: "/images/melody-performance.jpg",
      voices: "/images/slideshow/slide3-events.jpg",
    },
    gear: {
      harmony: "/images/harmony-bg.jpg",
      melody: "/images/melody-bg.jpg",
      voices: "/images/slideshow/slide4-shop.jpg",
    },
    contact: {
      harmony: "/images/harmony-performance.jpg",
      melody: "/images/melody-performance.jpg",
      voices: "/images/slideshow/slide5-contact.jpg",
    },
    leadership: {
      harmony: "/images/leadership-hero.jpg",
      melody: "/images/leadership-hero.jpg",
      voices: "/images/leadership-hero.jpg",
    },
  },
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const settings = await kv.get<SiteSettings>(KEYS.SITE_SETTINGS);
    // Merge with defaults to ensure all fields exist
    if (settings) {
      return {
        logos: { ...DEFAULT_SITE_SETTINGS.logos, ...settings.logos },
        pageBanners: {
          home: { ...DEFAULT_SITE_SETTINGS.pageBanners.home, ...settings.pageBanners?.home },
          about: { ...DEFAULT_SITE_SETTINGS.pageBanners.about, ...settings.pageBanners?.about },
          join: { ...DEFAULT_SITE_SETTINGS.pageBanners.join, ...settings.pageBanners?.join },
          media: { ...DEFAULT_SITE_SETTINGS.pageBanners.media, ...settings.pageBanners?.media },
          donate: { ...DEFAULT_SITE_SETTINGS.pageBanners.donate, ...settings.pageBanners?.donate },
          events: { ...DEFAULT_SITE_SETTINGS.pageBanners.events, ...settings.pageBanners?.events },
          gear: { ...DEFAULT_SITE_SETTINGS.pageBanners.gear, ...settings.pageBanners?.gear },
          contact: { ...DEFAULT_SITE_SETTINGS.pageBanners.contact, ...settings.pageBanners?.contact },
          leadership: { ...DEFAULT_SITE_SETTINGS.pageBanners.leadership, ...settings.pageBanners?.leadership },
        },
        splashBackgrounds: settings.splashBackgrounds,
        heroSlideBackground: settings.heroSlideBackground,
        updatedAt: settings.updatedAt,
        updatedBy: settings.updatedBy,
      };
    }
    return DEFAULT_SITE_SETTINGS;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function updateSiteSettings(
  data: Partial<SiteSettings>,
  updatedBy?: string
): Promise<SiteSettings> {
  const current = await getSiteSettings();
  const updated: SiteSettings = {
    logos: { ...current.logos, ...data.logos },
    pageBanners: {
      home: { ...current.pageBanners.home, ...data.pageBanners?.home },
      about: { ...current.pageBanners.about, ...data.pageBanners?.about },
      join: { ...current.pageBanners.join, ...data.pageBanners?.join },
      media: { ...current.pageBanners.media, ...data.pageBanners?.media },
      donate: { ...current.pageBanners.donate, ...data.pageBanners?.donate },
      events: { ...current.pageBanners.events, ...data.pageBanners?.events },
      gear: { ...current.pageBanners.gear, ...data.pageBanners?.gear },
      contact: { ...current.pageBanners.contact, ...data.pageBanners?.contact },
      leadership: { ...current.pageBanners.leadership, ...data.pageBanners?.leadership },
    },
    splashBackgrounds: { ...current.splashBackgrounds, ...data.splashBackgrounds },
    heroSlideBackground: { ...current.heroSlideBackground, ...data.heroSlideBackground },
    updatedAt: new Date().toISOString(),
    updatedBy,
  };
  await kv.set(KEYS.SITE_SETTINGS, updated);
  return updated;
}

// ============ SEED EXISTING IMAGES ============

// Predefined list of existing images in the repo
const EXISTING_IMAGES: Array<{
  name: string;
  url: string;
  category: SiteImage["category"];
  chorus: SiteImage["chorus"];
  alt: string;
}> = [
  // Harmony images
  { name: "Harmony Background", url: "/images/harmony-bg.jpg", category: "hero", chorus: "harmony", alt: "Parkside Harmony background" },
  { name: "Harmony Performance", url: "/images/harmony-performance.jpg", category: "banner", chorus: "harmony", alt: "Parkside Harmony performance" },
  // Melody images
  { name: "Melody Background", url: "/images/melody-bg.jpg", category: "hero", chorus: "melody", alt: "Parkside Melody background" },
  { name: "Melody Performance", url: "/images/melody-performance.jpg", category: "banner", chorus: "melody", alt: "Parkside Melody performance" },
  // Voices/Combined images
  { name: "Main Hero", url: "/images/placeholder-hero.jpg", category: "hero", chorus: "voices", alt: "Parkside Voices hero" },
  { name: "Join Page Hero", url: "/images/join-hero.jpg", category: "hero", chorus: "voices", alt: "Join Parkside" },
  { name: "Progression Hero", url: "/images/progression_hero.jpg", category: "progression", chorus: "voices", alt: "Parkside progression" },
  // Slideshow images
  { name: "Slideshow - Main", url: "/images/slideshow/slide1-main.jpg", category: "slideshow", chorus: "voices", alt: "Main slideshow" },
  { name: "Slideshow - Donate", url: "/images/slideshow/slide2-donate.jpg", category: "slideshow", chorus: "voices", alt: "Donate slideshow" },
  { name: "Slideshow - Events", url: "/images/slideshow/slide3-events.jpg", category: "slideshow", chorus: "voices", alt: "Events slideshow" },
  { name: "Slideshow - Shop", url: "/images/slideshow/slide4-shop.jpg", category: "slideshow", chorus: "voices", alt: "Shop slideshow" },
  { name: "Slideshow - Contact", url: "/images/slideshow/slide5-contact.jpg", category: "slideshow", chorus: "voices", alt: "Contact slideshow" },
  // Gallery images
  { name: "Gallery 1", url: "/images/placeholder-gallery-1.jpg", category: "other", chorus: "voices", alt: "Gallery image 1" },
  { name: "Gallery 2", url: "/images/placeholder-gallery-2.jpg", category: "other", chorus: "voices", alt: "Gallery image 2" },
  { name: "Gallery 3", url: "/images/placeholder-gallery-3.jpg", category: "other", chorus: "voices", alt: "Gallery image 3" },
  { name: "Gallery 4", url: "/images/placeholder-gallery-4.jpg", category: "other", chorus: "voices", alt: "Gallery image 4" },
  // Logos
  { name: "Parkside Logo", url: "/images/parkside-logo.png", category: "other", chorus: "voices", alt: "Parkside logo" },
  { name: "BHS Logo", url: "/images/bhs-logo.png", category: "other", chorus: "voices", alt: "BHS logo" },
  { name: "MAD Logo", url: "/images/MAD_logo.gif", category: "other", chorus: "voices", alt: "MAD District logo" },
];

export async function seedExistingImages(createdBy?: string): Promise<{ added: number; skipped: number }> {
  const existingImages = await getImages();
  const existingUrls = new Set(existingImages.map(img => img.url));

  let added = 0;
  let skipped = 0;

  for (const img of EXISTING_IMAGES) {
    if (existingUrls.has(img.url)) {
      skipped++;
      continue;
    }

    await createImage({
      name: img.name,
      url: img.url,
      category: img.category,
      chorus: img.chorus,
      alt: img.alt,
      createdBy,
    });
    added++;
  }

  return { added, skipped };
}
