import { kv } from "@vercel/kv";
import { v4 as uuidv4 } from "uuid";
import type {
  NewsItem,
  EventItem,
  VideoItem,
  SiteImage,
  AdminUser,
  SiteSettings,
  PageContent,
  AllPageContent,
  PageKey,
  LeadershipMember,
  LeadershipCategory,
} from "@/types/admin";

// KV Keys
const KEYS = {
  NEWS: "admin:news",
  EVENT_OVERRIDES: "admin:event-overrides",
  VIDEOS: "admin:videos",
  IMAGES: "admin:images",
  ADMIN_USERS: "admin:users",
  SITE_SETTINGS: "admin:site-settings",
  PAGE_CONTENT: "admin:page-content",
  LEADERSHIP: "admin:leadership",
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
  chorusCardImages: {
    harmony: "/images/harmony-bg.jpg",
    melody: "/images/melody-bg.jpg",
    voices: "/images/voices-bg.jpg",
  },
  aboutStoryImages: {
    harmony: "/images/placeholder-story.jpg",
    melody: "/images/placeholder-story.jpg",
    voices: "/images/placeholder-story.jpg",
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
        chorusCardImages: { ...DEFAULT_SITE_SETTINGS.chorusCardImages, ...settings.chorusCardImages },
        aboutStoryImages: { ...DEFAULT_SITE_SETTINGS.aboutStoryImages, ...settings.aboutStoryImages },
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
    chorusCardImages: { ...current.chorusCardImages, ...data.chorusCardImages },
    aboutStoryImages: { ...current.aboutStoryImages, ...data.aboutStoryImages },
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

// ============ PAGE CONTENT MANAGEMENT ============

// Default page content values
const DEFAULT_PAGE_CONTENT: AllPageContent = {
  home: {
    // Hero slide descriptions per chorus
    heroDescription_harmony: "A cappella chorus singing in the barbershop style",
    heroDescription_melody: "Treble-voiced ensemble celebrating harmony",
    heroDescription_voices: "Two choruses united in song",
    // Our Choruses section card descriptions
    chorusCard_harmony: "Parkside Harmony is a vibrant a cappella chorus singing in the barbershop style. Join us for incredible music and lasting friendships.",
    chorusCard_melody: "Parkside Melody is a treble-voiced ensemble dedicated to musical excellence and community. Discover the joy of four-part harmony.",
    chorusCard_voices: "Experience the full Parkside sound with both choruses performing together. Unity through harmony.",
  },
  about: {
    // Harmony "Our Story" content
    storyIntro_harmony: "Parkside Harmony has grown from a small group of passionate singers into one of the premier barbershop choruses in the Mid-Atlantic region.",
    storyDetail_harmony: "Since our founding in 2015, we have achieved multiple district championships and international recognition, including a Silver Medal at the 2023 BHS International Competition in Louisville, Kentucky.",
    // Melody "Our Story" content
    storyIntro_melody: "Parkside Melody was born from a shared love of harmony singing and a desire to create a welcoming space for singers to experience the joy of barbershop.",
    storyDetail_melody: "Founded in 2018, we have quickly grown into a dynamic chorus that combines competitive excellence with community outreach and musical education.",
    // Voices "Our Story" content
    storyIntro_voices: "Founded in 2015, Parkside has grown from a small group of passionate singers into two vibrant choruses that represent the very best of barbershop harmony in the mid-atlantic region.",
    storyDetail_voices: "Our journey began with a vision to create a space where singers could pursue musical excellence while fostering meaningful connections within our community. Today, that vision has blossomed into a thriving organization that continues to push the boundaries of a cappella performance.",
  },
  leadership: {
    heroTitle: "Our Leadership",
    heroSubtitle: "Meet the dedicated team guiding Parkside's musical excellence and organizational success.",
    musicLeadershipTitle: "Music Leadership",
    boardMembersTitle: "Board Members",
    boardAtLargeTitle: "Board Members at Large",
    getInvolvedTitle: "Want to Get Involved?",
    getInvolvedText: "We're always looking for passionate individuals to join our chorus and contribute to our mission of musical excellence.",
    getInvolvedButtonText: "Join Our Chorus",
  },
  join: {
    heroTitle: "Join Parkside",
    heroSubtitle: "Become part of our musical family",
    benefitsTitle: "Member Benefits",
    ctaButtonText: "Apply Now",
  },
  events: {
    heroTitle: "Upcoming Events",
    heroSubtitle: "Join us for performances and community gatherings",
  },
  media: {
    heroTitle: "Media Gallery",
    heroSubtitle: "Explore our performances and memories",
    videosTitle: "Videos",
    photosTitle: "Photos",
  },
  contact: {
    heroTitle: "Contact Us",
    heroSubtitle: "We'd love to hear from you",
    formTitle: "Send us a Message",
    formIntro: "Have questions? Fill out the form below and we'll get back to you.",
  },
  donate: {
    heroTitle: "Support Parkside",
    heroSubtitle: "Help us keep the music alive",
    mainMessage: "Your generous donations help us continue our mission of musical excellence.",
    ctaButtonText: "Donate Now",
  },
  gear: {
    heroTitle: "Parkside Gear",
    heroSubtitle: "Shop official Parkside merchandise",
  },
};

export async function getPageContent(): Promise<AllPageContent> {
  try {
    const content = await kv.get<AllPageContent>(KEYS.PAGE_CONTENT);
    if (content) {
      // Merge with defaults to ensure all pages have content
      const merged: AllPageContent = { ...DEFAULT_PAGE_CONTENT };
      for (const pageKey of Object.keys(DEFAULT_PAGE_CONTENT) as PageKey[]) {
        merged[pageKey] = { ...DEFAULT_PAGE_CONTENT[pageKey], ...content[pageKey] };
      }
      return merged;
    }
    return DEFAULT_PAGE_CONTENT;
  } catch (error) {
    console.error("Error fetching page content:", error);
    return DEFAULT_PAGE_CONTENT;
  }
}

export async function getPageContentByPage(pageKey: PageKey): Promise<PageContent> {
  const allContent = await getPageContent();
  return allContent[pageKey] || DEFAULT_PAGE_CONTENT[pageKey] || {};
}

export async function updatePageContent(
  pageKey: PageKey,
  content: Partial<PageContent>,
  _updatedBy?: string
): Promise<PageContent> {
  const allContent = await getPageContent();
  const updated: AllPageContent = {
    ...allContent,
    [pageKey]: {
      ...allContent[pageKey],
      ...content,
    },
  };
  await kv.set(KEYS.PAGE_CONTENT, updated);
  return updated[pageKey];
}

export async function updateAllPageContent(
  content: Partial<AllPageContent>,
  _updatedBy?: string
): Promise<AllPageContent> {
  const current = await getPageContent();
  const updated: AllPageContent = { ...current };

  for (const pageKey of Object.keys(content) as PageKey[]) {
    if (content[pageKey]) {
      updated[pageKey] = { ...current[pageKey], ...content[pageKey] };
    }
  }

  await kv.set(KEYS.PAGE_CONTENT, updated);
  return updated;
}

// ============ LEADERSHIP MANAGEMENT ============

// Default leadership members (seeded from current hardcoded data)
const DEFAULT_LEADERSHIP: LeadershipMember[] = [
  // Music Leadership
  {
    id: "sean-devine",
    name: "Sean Devine",
    title: "Artistic Director & Immediate Past President",
    bio: "Sean brings over 30 years of professional stage experience, design, and education to Parkside Harmony. He is a highly sought-after coach & clinician, a certified Performance Judge (BHS), and a champion quartet singer with OC Times. Born and raised right here in \"The Sweetest Place on Earth,\" Sean spent six years performing in the resident shows at Hersheypark. From 2001 to 2008, he toured professionally with America's Premier Doo-Wop Group, The Alley Cats. For the past 10 years, he has sung lead with Throwback, 7-time International Quartet Medalists.\n\nAdditionally, Sean serves as the Executive Director for the Association of International Champions (AIC), a non-profit organization dedicated to preserving barbershop quartet singing through gold-medal performances, recordings, productions, seminars, and financial support.",
    photoUrl: "/images/seandevine.jpg",
    category: "musicLeadership",
    chorusAffiliation: "both",
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "vince-sandroni",
    name: "Vince Sandroni",
    title: "Music Director",
    bio: "Vince began his musical career with 15 years in the Maryland State Boychoir, serving as a chorister, soloist, and conducting intern. He graduated from Towson University with a Bachelor's of Science in Music Education. During his time there he performed in multiple productions including a lead role in Die Fledermaus. Vince is the chorus teacher at Cockeysville Middle School in Baltimore County. He started singing barbershop in High School and has since participated in numerous conventions, Harmony Brigades, and the No Borders Youth Consort.\n\nA proud Parksider, Vince also sings tenor in the 2016 Barbershop Harmony Society Youth Quartet International Champions, Pratt Street Power!",
    photoUrl: "/images/vincesandroni.png",
    category: "musicLeadership",
    chorusAffiliation: "harmony",
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "melody-hine",
    name: "Melody Hine",
    title: "Director of Parkside Melody",
    bio: "Bio coming soon.",
    photoUrl: "/images/melodyhine.jpg",
    category: "musicLeadership",
    chorusAffiliation: "melody",
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "maddie-larrimore",
    name: "Maddie Larrimore",
    title: "Director of Parkside Melody",
    bio: "Madeleine Larrimore is a dedicated educator and accomplished musician based in Baltimore, MD. She holds a Bachelor's degree in Vocal Music Education from Towson University (2017), where she was actively involved in various ensembles and productions. A key moment in her time at Towson was studying choral conducting with Dr. Arian Khaefi, during which her passion for barbershop music grew. This inspired her to attend both District and International Conventions.\n\nAs a high school chorus teacher, Maddie introduced barbershop singing into her curriculum, sending a mixed quartet of students to the Harmony College East barbershop camp in 2019. She later earned a Master's degree in Music Education from Longy School of Music at Bard College (2023), with a capstone project focused on incorporating barbershop harmony into high school choral classrooms. This project provides a curriculum for educators looking to introduce barbershop music into their teaching.\n\nIn the Spring of 2024, Maddie had the privilege of teaching Barbershop Pedagogy at Towson University as an adjunct faculty member. As a charter member of Parkside Melody, she is excited to witness the group's growth and loves co-directing alongside Melody Hine.",
    photoUrl: "/images/mlarrimore.jpg",
    category: "musicLeadership",
    chorusAffiliation: "melody",
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Board Members
  {
    id: "clay-monson",
    name: "Clay Monson",
    title: "President",
    bio: "Clay's musical journey began in church and high school all-state choruses and a cappella chamber ensembles. He joined the Barbershop Harmony Society (BHS) in 2015 as a bass singer with the Chorus of the Genesee, where he served as Programming Vice President. In 2017, Clay joined Harmonic Collective, serving as Vice President of Chapter Development and later as Chapter President. He became a certified BHS Performance Judge in 2023.\n\nClay joined Parkside Harmony in early 2023, quickly becoming an integral part of the organization. He serves as Performance Coordinator on the Music team and was a Board Member at Large in 2024 before becoming Chapter President.\n\nProfessionally, Clay taught middle and high school ELA for eight years before transitioning to the private sector in 2021 as a Literacy Specialist and consultant. He is now the Professional Learning Manager for the Northeast Region at a large educational publisher. Clay is also an active Performance and Stage Communication coach, working with Barbershop choruses, quartets, and other ensembles. He frequently judges Novice Quartet contests and volunteers for youth contest preliminary rounds for the BHS. He has served as faculty for BHS's Virtual Harmony University and will be part of Barbershop in Germany (BinG!)'s educational event in 2025.\n\nOutside of his professional and musical endeavors, Clay shares his passion for music and education as the Mid-Atlantic District's Vice President of Education. His dedication to fostering a supportive environment for Parkside Harmony members is evident in his leadership and commitment to the chorus's success.\n\nClay Monson is dedicated to the growth and success of both Parkside's world class ensembles and continually enhancing the musical and social experiences for all members. He invites you to connect with him and learn more about our vibrant community.",
    photoUrl: "/images/cmonson.jpg",
    category: "boardMember",
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "anthony-arbaiza",
    name: "Anthony Arbaiza",
    title: "Executive Vice President of Marketing",
    bio: "Anthony Arbaiza brings a deep love for barbershop music and a wealth of experience in data analytics and strategic marketing to his role as Vice President of Marketing for Parkside Harmony. A dedicated member of the chorus, Anthony has found not only a creative outlet in singing but also a strong sense of brotherhood and community within Parkside.\n\nOriginally from New York City, Anthony's background is as diverse as his passions. He holds a degree in Acting from NYU's Tisch School of the Arts and later earned a Master's in Data Science from Penn State University, blending creativity with analytical expertise. His professional career as a Data and Analytics Manager is rooted in environmental monitoring and data-driven decision-making, but he has always found ways to merge his storytelling abilities with his technical acumen—skills that serve him well in leading Parkside's marketing efforts.\n\nBeyond his professional and musical pursuits, Anthony is an avid traveler and outdoor enthusiast. He has hiked and camped in breathtaking locations such as Yosemite National Park, Canada, and the deserts of Arizona, embracing the challenge and beauty of the natural world. His love for performance extends beyond music, as he remains actively involved in theater of all kinds, with a particular draw to musical productions.\n\nAs VP of Marketing, Anthony is committed to expanding Parkside Harmony's reach, celebrating its members, and ensuring that the joy of barbershop music continues to inspire audiences far and wide.",
    photoUrl: "/images/aarbaiza.png",
    category: "boardMember",
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "rick-crider",
    name: "Rick Crider",
    title: "Vice President of Membership",
    bio: "Rick Crider has had a lifelong passion for music. He enjoys playing the piano and is also in the process of learning the guitar, demonstrating his love for musical exploration and growth.\n\nRick has been a dedicated member of the Barbershop Harmony Society for 20 years. His journey with the society began with the Chorus of the Blue Juniata in Lewistown, PA, and continued with the Nittany Knights in State College, PA. These experiences have allowed him to engage deeply with the barbershop music community and further develop his musical skills.\n\nIn addition to his involvement with choruses, Rick also enjoys singing with his two quartets, Level Best and The Young and the Rest of Us. These groups provide him with additional opportunities to express his musical talents and collaborate with other passionate singers.\n\nRick is also committed to supporting the barbershop music community in a leadership role. He serves as the chair of the Membership Committee of Parkside Harmony, a position that allows him to contribute to the organization's growth and development. He considers it an honor to hold this position and is dedicated to fulfilling his responsibilities with enthusiasm and dedication.",
    photoUrl: "/images/rcrider.jpg",
    category: "boardMember",
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "nikki-burkhardt",
    name: "Nikki Burkhardt",
    title: "Secretary",
    bio: "Nikki has a rich background in barbershop music, with 17 years of experience. She currently sings Lead with Parkside Melody and Tenor with her quartet, Midnight Society, as well as with her Sweet Adelines Chorus, Valley Forge. Her musical journey began at the tender age of 8, when she performed with the Delaware Children's Chorus, Delaware All-State Chorus, and the National Children's Chorus. She also engaged in local community theater productions.\n\nNikki is a founding member of the Celtic Fusion band Mythica, where she contributed her vocal talents as well as played the flute, Irish whistle, and hand percussion. From 2006 to 2012, Mythica toured across the US, sharing the stage with renowned artists like The Spin Doctors and Sister Hazel.\n\nNikki's formal music education includes a Certificate of Music from the Wilmington Music School (now known as the Music School of Delaware), where she studied voice under Elliot Jones. Her skills extend beyond singing, as she has professional training in dance, costuming, lighting, and stage makeup. She has also worked professionally at the Three Little Bakers Dinner Theater.\n\nIn addition to her musical pursuits, Nikki has an impressive academic and professional background in engineering. She holds a Bachelor of Environmental Engineering degree and a Master of Civil Engineering degree from the University of Delaware. She is a licensed Professional Engineer and a Board Certified Environmental Engineer. Nikki works as a Landfill Gas Engineer for the Delaware Solid Waste Authority, where she is responsible for regulatory compliance. She is also the incoming Director of the Landfill Gas and Biogas Technical Division of the Solid Waste Association of North America.",
    photoUrl: "/images/nikkib.jpg",
    category: "boardMember",
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tom-nisbet",
    name: "Tom Nisbet",
    title: "Treasurer",
    bio: "Tom Nisbet is a seasoned software engineering consultant and an accomplished entrepreneur. He is the founder of Visual Networks, a network analysis company that he successfully grew from a small team of five employees to a large organization with over 500 staff members.\n\nIn addition to his professional career in software engineering, Tom is deeply involved in community music initiatives. He serves on the Board of the Sherwood Community Chamber Choir, contributing to the choir's strategic direction and growth. Tom also holds a key role in the Barbershop Harmony Society, serving as the Events Treasurer for the Mid-Atlantic District. This position allows him to combine his financial acumen with his passion for music.\n\nTom's expertise in software engineering is backed by solid academic credentials. He holds a Master of Science degree in Computer Engineering from Johns Hopkins University, a renowned institution known for its rigorous engineering programs. Prior to that, he earned a Bachelor of Science degree in Computer Science from Frostburg State University. These qualifications have undoubtedly played a significant role in his successful career and contributions to the field of software engineering.",
    photoUrl: "/images/tnisbet.png",
    category: "boardMember",
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Board Members at Large
  {
    id: "drew-xentaras",
    name: "Drew Xentaras",
    title: "Board Member at Large",
    bio: "Drew Xentaras has been actively singing with Parkside Harmony since 2018 where he serves as the Performance Attire Manager for the chorus. Drew caught the barbershop \"bug\" in 1983 when he was a junior in high school where he sang with the Centennial State Chorus in Sterling, CO. After moving to Lancaster, PA, Drew sang with the Red Rose Chorus under the direction of Dr. Jay Butterfield.\n\nDrew achieved his Bachelor of Arts degree in 1988 from Hastings College majoring in Theatre Arts, Speech Communication, and Secondary Education. Since 1989, Drew has been employed with American Airlines, Inc. as an international flight attendant where he met his wife, Laura and is based at New York's JFK International Airport.\n\nDrew is father to two adult sons, Christian and Daniel and grandfather to his precious Lucy.\n\nDrew is so blessed to be a Parkside Board Member and will do all in his power to serve well.",
    photoUrl: "/images/drewx.jpg",
    category: "boardAtLarge",
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "sally-galloway",
    name: "Sally Galloway",
    title: "Board Member at Large",
    bio: "Sally's barbershop journey started early, humming the baritone line along to her mom's quartet rehearsals before officially joining Sweet Adelines at 13 and later BHS in 2013. With a BA in Music, a master's in Music Education, and decades as a massage therapist and certified life/health coach, she blends her love of harmony, empowerment, and coaching to help others find their voices—both in singing and in life. She has directed and taught choirs, private voice lessons, and mentored small choruses in building their identity, leadership, and musical excellence.\n\nSally has sung with 15 barbershop choruses and a dozen quartets across the US and England, also serving as a certified director, section leader, assistant director, and choreography coach. She helped prepare the Pride of Baltimore Chorus for the International stage, directs the BHS Old Dominion Chorus, and currently sings bass while serving on the Performance Team for Parkside Melody. She is also VP of the Central Division of the Mid-Atlantic District and a faculty member at Harmony College East, where she teaches yoga for singers and the psychological aspects of performance. A certified professional coach since 2001, she helps people nationwide manage stress, anxiety, and depression, while her international private practice specializes in helping singers overcome performance anxiety, boost confidence, and make music more fun.\n\nPassionate about personal growth, Sally thrives on helping people unlock their confidence—whether through singing, coaching, or personal transformation. She's fascinated by mind-body connections, energy work, and positive psychology, which influence her coaching style. A lifelong teacher and creator, she designs workshops, retreats, and frameworks to help others learn and thrive. She also secretly loves geeking out over details, from chord analysis to foreign-language pronunciation to which spices enhance foods' flavors and healing properties. With her warm, energetic, and supportive approach, Sally makes every interaction an adventure in growth, harmony, and joy.",
    photoUrl: "/images/sallyg.png",
    category: "boardAtLarge",
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tim-dawson",
    name: "Tim Dawson",
    title: "Board Member at Large",
    bio: "Tim is relatively new to Barbershop, having joined Parkside Harmony during the pandemic via Zoom in 2021, but he has been singing since the early days as a pastor's kid. He has a degree in Music Education from Messiah University and an M.Ed in Higher Education from The Pennsylvania State University. He has been a member of the Harrisburg Singers, worship leader and church musician in the Harrisburg area for many years but has recently moved to Silver Spring, MD.\n\nBy day, he is a Strategic Business Advisor for Ellucian, providing software solutions for student success for colleges & universities. He has worked as an Enrollment Manager for both Messiah University and Harrisburg University of Science & Technology prior to joining Ellucian.\n\nIn addition to music and student success, he loves Walt Disney World and is a collector of memorabilia from the early days of the park which opened the year he was born. He is drawn to the way they tell stories and is pleased to be able to do that everyday at work and thru music with Parkside!",
    photoUrl: "/images/timd.jpg",
    category: "boardAtLarge",
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "don-staffin",
    name: "Don Staffin",
    title: "Board Member at Large",
    bio: "Don has a long-standing history with a cappella choruses, having been involved in singing, directing, managing, and arranging for them for many years. His passion for a cappella music is shared with his wife, Chris, who is also a member of Parkside. Together, they co-directed their a cappella group at Cornell University.\n\nIn 2011, Don joined the Barbershop Harmony Society and has since made significant contributions to the organization. He currently serves as the VP/Artistic Director of Somerset Hills Harmony in New Jersey. Don has been a trailblazer in promoting inclusivity within the society, pioneering the \"Everyone in Harmony\" initiative and creating one of the early mixed chapters within the Barbershop Harmony Society.\n\nBeyond his musical endeavors, Don is a global executive in e-commerce for the commercial maritime industry. Despite his demanding professional role, he also finds time to work with youth in music, having coached, arranged, and directed a cappella in the Bridgewater-Raritan School District since 2007.\n\nDon's creative output extends to publishing as well. He has published more than thirty a cappella arrangements, showcasing his talent for musical composition. He is also a published book author, further demonstrating his diverse range of skills.\n\nIn addition to his professional and musical accomplishments, Don has a unique set of interests and talents. He is father of four grown daughters (including a set of triplets), and a \"certified cow whisperer\". He has also showcased his sense of humor and ability to entertain as a performer and producer of clean comedy shows, having appeared on stage on three continents.",
    photoUrl: "/images/dons.jpg",
    category: "boardAtLarge",
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function getLeadership(): Promise<LeadershipMember[]> {
  try {
    const leadership = await kv.get<LeadershipMember[]>(KEYS.LEADERSHIP);
    return leadership || DEFAULT_LEADERSHIP;
  } catch (error) {
    console.error("Error fetching leadership:", error);
    return DEFAULT_LEADERSHIP;
  }
}

export async function getLeadershipByCategory(category: LeadershipCategory): Promise<LeadershipMember[]> {
  const all = await getLeadership();
  return all
    .filter(m => m.category === category)
    .sort((a, b) => a.order - b.order);
}

export async function createLeadershipMember(
  data: Omit<LeadershipMember, "id" | "createdAt" | "updatedAt">
): Promise<LeadershipMember> {
  const leadership = await getLeadership();

  // Get max order for this category
  const categoryMembers = leadership.filter(m => m.category === data.category);
  const maxOrder = categoryMembers.length > 0
    ? Math.max(...categoryMembers.map(m => m.order))
    : -1;

  const newMember: LeadershipMember = {
    ...data,
    id: uuidv4(),
    order: data.order ?? maxOrder + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await kv.set(KEYS.LEADERSHIP, [...leadership, newMember]);
  return newMember;
}

export async function updateLeadershipMember(
  id: string,
  data: Partial<LeadershipMember>
): Promise<LeadershipMember | null> {
  const leadership = await getLeadership();
  const index = leadership.findIndex(m => m.id === id);
  if (index === -1) return null;

  leadership[index] = {
    ...leadership[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  await kv.set(KEYS.LEADERSHIP, leadership);
  return leadership[index];
}

export async function deleteLeadershipMember(id: string): Promise<boolean> {
  const leadership = await getLeadership();
  const filtered = leadership.filter(m => m.id !== id);
  if (filtered.length === leadership.length) return false;
  await kv.set(KEYS.LEADERSHIP, filtered);
  return true;
}

export async function reorderLeadership(
  category: LeadershipCategory,
  orderedIds: string[]
): Promise<LeadershipMember[]> {
  const leadership = await getLeadership();

  // Update order for members in this category
  const updated = leadership.map(member => {
    if (member.category === category) {
      const newOrder = orderedIds.indexOf(member.id);
      if (newOrder !== -1) {
        return { ...member, order: newOrder, updatedAt: new Date().toISOString() };
      }
    }
    return member;
  });

  await kv.set(KEYS.LEADERSHIP, updated);
  return updated.filter(m => m.category === category).sort((a, b) => a.order - b.order);
}

export async function seedLeadership(createdBy?: string): Promise<{ seeded: boolean }> {
  const existing = await kv.get<LeadershipMember[]>(KEYS.LEADERSHIP);
  if (existing && existing.length > 0) {
    return { seeded: false };
  }

  const seededMembers = DEFAULT_LEADERSHIP.map(member => ({
    ...member,
    createdBy,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  await kv.set(KEYS.LEADERSHIP, seededMembers);
  return { seeded: true };
}
