# Parkside Website - Developer Guide

This document provides context for AI assistants and developers working on this codebase.

## Project Overview

This is a Next.js 14+ website for **Parkside Barbershop** - a barbershop organization with three chorus identities:
- **Parkside Harmony** - A cappella chorus (TTBB)
- **Parkside Melody** - Treble-voiced ensemble (SSAA)
- **Parkside Voices** - Combined identity representing both choruses together

The site dynamically changes content based on which chorus the visitor selects.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion (drag gestures, transitions, animations)
- **Data Storage**: Dual-source system:
  - **Scraped content**: JSON files in `public/data/` (events.json, news.json)
  - **Admin edits**: Vercel KV (overrides, admin-created content)
- **Authentication**: Simple password-based admin (stored in cookies)

## Project Structure

```
src/
├── app/
│   ├── (site)/          # Public pages (about, contact, events, etc.)
│   ├── admin/           # Admin dashboard pages
│   └── api/             # API routes
├── components/
│   ├── events/          # Event-related components
│   ├── layout/          # Header, Footer, navigation
│   ├── news/            # News components
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities, context, data functions
└── types/               # TypeScript type definitions
```

## Key Architectural Patterns

### 1. Chorus Selection System

The most important feature. Users can select "Harmony", "Melody", or "All Voices" and content filters accordingly.

**Files:**
- `src/lib/chorus-context.tsx` - React context provider
- `src/components/layout/ChorusSelector.tsx` - UI selector in header

**Usage:**
```tsx
import { useChorus, shouldShowForChorus } from "@/lib/chorus-context";

// In a component
const { chorus } = useChorus(); // "harmony" | "melody" | "voices"

// Filter content
const filtered = items.filter(item => shouldShowForChorus(item.chorus, chorus));
```

**Important:** The `shouldShowForChorus()` function does case-insensitive comparison. Content with chorus "voices" or "both" shows for all selections.

### 2. Admin Data System (Dual-Source Architecture)

The site uses a **dual-source data architecture**:

1. **Scraped JSON files** (`public/data/`): Content scraped from parksideharmony.org
   - `events.json` - Events from external calendar
   - `news.json` - News articles from external site

2. **Vercel KV**: Admin-created content and overrides
   - Event overrides (edits to scraped events)
   - Admin-created news articles
   - Images, videos, site settings

**Key file:** `src/lib/admin-data.ts` - Contains all CRUD functions for Vercel KV data.

**How it works:**
- Public APIs (`/api/events`, `/api/news`) merge both sources
- Admin edits are stored as "overrides" that take precedence over scraped content
- Sync buttons import scraped content into admin for editing

### 3. Site Branding System

Per-page, per-chorus banner images and logos configured via admin.

**Files:**
- `src/types/admin.ts` - `SiteSettings` type definition
- `src/hooks/usePageBanner.ts` - Hook for fetching page banners
- `src/app/admin/branding/page.tsx` - Admin UI for branding

**Usage:**
```tsx
import { usePageBanner } from "@/hooks/usePageBanner";

const bannerImage = usePageBanner("about"); // Returns URL for current chorus
```

**Shared banner pages:** Donate and Gear use the same banner regardless of chorus selection.

### 4. API Routes

All in `src/app/api/`:
- `/api/events` - Public events (merges scraped JSON + admin overrides)
- `/api/news` - Public news (merges scraped JSON + admin KV)
- `/api/admin/events/sync` - Sync events from parksideharmony.org
- `/api/admin/events/scraped/[id]` - Get/update scraped event overrides
- `/api/admin/news/sync` - Import scraped news into admin
- `/api/images` - Image metadata
- `/api/videos` - Video management
- `/api/admin/site-settings` - Site branding
- `/api/admin/images/seed` - Seeds existing repo images to admin
- `/api/contact` - Contact form submissions

### 5. Events System

Events are scraped from parksideharmony.org and can be edited via admin.

**Files:**
- `src/app/api/admin/events/sync/route.ts` - Scrapes events, delta checking, 180-day cleanup
- `src/app/api/events/route.ts` - Public API merging scraped + overrides
- `src/components/admin/SyncEventsButton.tsx` - UI for triggering sync
- `src/components/events/EventsList.tsx` - Displays events with filtering

**Features:**
- **Sync from source**: Fetches events from parksideharmony.org using cheerio
- **Delta checking**: Only adds events not already present (by title+date)
- **180-day cleanup**: Automatically removes events older than 180 days during sync
- **Admin overrides**: Edit scraped events; changes stored in KV and merged at display time
- **Past events tab**: Toggle between "Upcoming" and "Past" events on public page

**Usage:**
```tsx
<EventsList
  title="Events"
  maxEvents={100}
  dataSource="api"
  apiUrl="/api/events"
  showFilters={true}
  showTimePeriodTabs={true}  // Enables Upcoming/Past tabs
/>
```

### 6. News System

News articles are scraped from parksideharmony.org and can be managed via admin.

**Files:**
- `src/app/api/admin/news/sync/route.ts` - Imports scraped news to admin KV
- `src/app/api/news/route.ts` - Public API merging scraped + admin news
- `src/components/admin/SyncNewsButton.tsx` - UI for importing news
- `src/components/news/NewsList.tsx` - Displays news with chorus filtering

**How it works:**
1. News is scraped to `public/data/news.json`
2. Admin clicks "Sync News" to import into Vercel KV
3. Once in KV, articles can be edited via admin
4. Public API merges both sources (admin takes precedence for duplicates)

### 7. Video/Media System

Videos are manually managed through the admin panel (no scraping).

**Files:**
- `src/app/(site)/media/page.tsx` - Public media gallery page
- `src/app/admin/videos/page.tsx` - Admin video list
- `src/app/admin/videos/new/page.tsx` - Add new video form
- `src/app/admin/videos/[id]/edit/page.tsx` - Edit existing video
- `src/app/api/videos/route.ts` - Public API for videos
- `src/app/api/admin/videos/route.ts` - Admin API for CRUD
- `src/app/api/admin/videos/[id]/route.ts` - Single video operations
- `src/app/api/admin/youtube-metadata/route.ts` - Fetches title/thumbnail from YouTube

**How it works:**
1. Admin navigates to `/admin/videos` and clicks "Add Video"
2. Pastes YouTube URL, clicks "Fetch" to auto-fill title and thumbnail
3. Admin can edit title, adds description, selects chorus tag (Harmony/Melody/Voices)
4. Optionally adds competition name and placement
5. Videos appear on public `/media` page with chorus filtering

**Video data structure:**
```typescript
interface VideoItem {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  year: number;
  chorus: "harmony" | "melody" | "voices";
  competition?: string;
  placement?: string;
  thumbnailUrl?: string;
}
```

**Storage:** Vercel KV (key: `admin:videos`)

## Component Patterns

### HeroSection
Reusable hero/banner component with parallax scrolling.

```tsx
<HeroSection
  title="Page Title"
  subtitle="Description"
  imagePath={bannerImage}
  imageAlt="Alt text"
  videoId="youtubeId" // Optional - plays video in background
/>
```

### PageTransition
Wraps page content for enter/exit animations.

### ScrollAnimation
Animates children when they enter viewport.

```tsx
<ScrollAnimation direction="left" delay={0.2}>
  <div>Content animates in from left</div>
</ScrollAnimation>
```

## Color Scheme

**Gender-neutral colors** (not blue/pink):
- **Harmony**: Indigo (`#6366F1`, `indigo-600`)
- **Melody**: Amber (`#F59E0B`, `amber-500`)
- **Combined/Voices**: Purple (`#8B5CF6`)

## Mobile/Tablet Responsive Design

The site uses mobile-first responsive design with Tailwind CSS breakpoints.

### Responsive Patterns

**Text sizing:**
```tsx
className="text-sm sm:text-base md:text-xl lg:text-2xl"
```

**Spacing:**
```tsx
className="py-12 sm:py-16 md:py-24"
className="px-4 sm:px-6 md:px-8"
```

**Layout changes:**
```tsx
className="flex flex-col sm:flex-row"  // Stack on mobile, row on larger
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

**Responsive heights:**
```tsx
className="h-[300px] sm:h-[400px] md:h-[500px]"
```

### Mobile Detection Pattern

For components needing JavaScript-based mobile detection:

```tsx
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth < 768);
  checkMobile();
  window.addEventListener("resize", checkMobile);
  return () => window.removeEventListener("resize", checkMobile);
}, []);
```

### Mobile Splash Page (Swipeable Carousel)

**File:** `src/components/splash/SplitScreen.tsx`

On mobile, the splash page transforms into a full-screen swipeable carousel:
- Uses Framer Motion drag gestures for swipe navigation
- Glassmorphism card design with `backdrop-blur-md`
- Dot indicators for current slide position
- Quick navigation buttons at bottom
- Subtle dark overlay on background images (`bg-black/30`)

**Key implementation details:**
- Desktop: Side-by-side 50/50 split with hover effects
- Mobile: Full-screen slides with swipe gestures
- Breakpoint: 768px (md)

## Image Upload & Processing

### Client-Side Image Processing

**File:** `src/app/admin/branding/page.tsx`

The `processImage()` function handles image uploads with:
- **Compression**: Resizes large images to reduce file size
- **White background**: Automatically adds white background to transparent PNGs
- **Size limits**: Logos max 500px/1MB, banners max 2000px/2MB

```tsx
const processedFile = await processImage(file, {
  maxSizeMB: type === "logo" ? 1 : 2,
  maxDimension: type === "logo" ? 500 : 2000,
  addWhiteBackground: type === "logo",
});
```

### Transparent PNG Handling

Transparent PNGs are problematic because:
- Browsers render transparency as black by default
- Dark logos on transparent backgrounds become invisible

**Solution:**
1. Client-side: `processImage()` draws white background before drawing image
2. Display-side: Logo containers have `bg-white` fallback

### Image Picker Modal

**File:** `src/components/admin/ImagePickerModal.tsx`

A reusable modal for selecting images with two modes:
- **Image Library**: Browse and select from previously uploaded images with category filtering
- **Upload New**: Upload a new image directly (with automatic processing)

**Usage in branding page:**
```tsx
<ImagePickerModal
  isOpen={pickerState?.isOpen ?? false}
  onClose={closePicker}
  onSelect={handleImageSelect}
  title="Select Image"
  currentImage={currentImageUrl}
  uploadConfig={{
    name: "image-name",
    category: "banner",
    alt: "Image description",
    chorus: "voices",
    processImage: (file) => processImage(file, options),
  }}
/>
```

### Image Edit Page

**File:** `src/app/admin/images/[id]/edit/page.tsx`

Allows editing image metadata:
- **Name**: Descriptive name for the image
- **Alt Text / Description**: Keywords and tags for searchability
- **Category**: slideshow, hero, banner, progression, other
- **Chorus Association**: harmony, melody, voices

## Common Gotchas & Lessons Learned

### 1. Case Sensitivity in Chorus Filtering
Scraped events may have capitalized chorus values ("Harmony") but the system expects lowercase ("harmony"). The `shouldShowForChorus()` function normalizes this, but be aware when debugging.

### 2. Client vs Server Components
Pages using `useChorus()` or `usePageBanner()` must be client components (`"use client"`). This includes most public pages.

### 3. Image Paths
- Repo images: `/images/filename.jpg`
- Admin-uploaded images go to `/data/uploads/` (if implemented)
- Always use fallback images for broken paths

### 4. Default Site Settings
Located in `src/lib/admin-data.ts` in `DEFAULT_SITE_SETTINGS`. If `site-settings.json` doesn't exist, these defaults are used.

### 5. Metadata in Client Components
Client components can't export `metadata`. Either:
- Keep as server component and pass data via props
- Use a separate `metadata.ts` file
- Accept that the page won't have custom metadata

### 6. Form Submissions & Email (Resend)
Contact form posts to `/api/contact` which sends emails via **Resend**.

**Current setup:**
- Emails sent FROM `onboarding@resend.dev` (Resend's default sender)
- Emails sent TO the address configured in `CONTACT_FORM_EMAIL` env var
- Reply-to is set to the form submitter's email
- Nicely formatted HTML email with all form details

**Environment variables:**
- `RESEND_API_KEY` - Get from [resend.com](https://resend.com) dashboard
- `CONTACT_FORM_EMAIL` - Destination email for form submissions (default: `info@parksideharmony.org`)

**To change destination email:**
Set the `CONTACT_FORM_EMAIL` environment variable in Vercel or your `.env.local` file.

**To send FROM your own domain:**
1. Go to Resend dashboard → Domains → Add Domain
2. Add DNS records (TXT for SPF/DKIM) at your domain registrar
3. Once verified, update the `from` field in the API route

### 7. Image Upload 413 Errors
Vercel serverless functions have a ~4.5MB payload limit. Large image uploads will fail with "413 Request Entity Too Large".

**Solution:** Always compress images client-side before uploading. The `processImage()` function in the branding page handles this automatically.

### 8. Transparent PNG Logos
When users upload logos with transparent backgrounds, browsers render the transparency as black, making dark logos invisible.

**Solution:**
- Process uploads to add white background using Canvas API
- Add `bg-white` to logo containers as a fallback
- See `src/app/admin/branding/page.tsx` for implementation

### 9. Framer Motion Drag Gestures
When implementing swipeable carousels:
- Use `drag="x"` with `dragConstraints={{ left: 0, right: 0 }}`
- Handle `onDragEnd` with `PanInfo` to detect swipe direction
- Use `animate` prop with slide index to control position
- Threshold of ~50px works well for swipe detection

### 10. Adding New Fields to SiteSettings
When adding new fields to the `SiteSettings` type in `src/types/admin.ts`, you MUST update **BOTH** functions in `src/lib/admin-data.ts`:

1. **`getSiteSettings()`** - Must include the new fields in the returned object when merging saved settings with defaults
2. **`updateSiteSettings()`** - Must include the new fields when constructing the updated settings object

**Example:** When `splashBackgrounds` and `heroSlideBackground` were added, settings weren't persisting because `getSiteSettings()` was omitting them from the return object, even though `updateSiteSettings()` was saving them correctly.

```typescript
// In getSiteSettings() - must return new fields:
return {
  logos: { ...DEFAULT_SITE_SETTINGS.logos, ...settings.logos },
  pageBanners: { ... },
  splashBackgrounds: settings.splashBackgrounds,  // Don't forget!
  heroSlideBackground: settings.heroSlideBackground,  // Don't forget!
  updatedAt: settings.updatedAt,
  updatedBy: settings.updatedBy,
};

// In updateSiteSettings() - must save new fields:
const updated: SiteSettings = {
  logos: { ...current.logos, ...data.logos },
  pageBanners: { ... },
  splashBackgrounds: { ...current.splashBackgrounds, ...data.splashBackgrounds },
  heroSlideBackground: { ...current.heroSlideBackground, ...data.heroSlideBackground },
  ...
};
```

### 11. Data Source Disconnect (Admin vs Public)
The most critical architectural pattern to understand:

- **Admin pages** read from Vercel KV (`getNews()`, `getEventOverrides()`)
- **Public pages** originally read from static JSON files (`/data/events.json`)
- **This causes edits in admin to not appear on the public site!**

**Solution:** Public API routes must merge both sources:
```typescript
// In /api/events/route.ts
const scrapedEvents = JSON.parse(fs.readFileSync('public/data/events.json'));
const overrides = await getEventOverrides();

// Merge overrides with scraped events
const events = scrapedEvents.map(event => {
  const override = overrideMap.get(event.id);
  return override ? { ...event, ...override } : event;
});
```

**Key rule:** If admin edits aren't showing on the public site, check if the public component is using the API (which merges sources) or reading directly from JSON.

### 12. Adding New Pages to Branding System
When adding a new page that needs configurable banners:

1. Add the page key to `PageKey` type in `src/types/admin.ts`
2. Add default banner in `usePageBanner.ts` `defaultBanners` object
3. Add to `pageInfo` and `pages` array in `src/app/admin/branding/page.tsx`
4. Add to `DEFAULT_SITE_SETTINGS.pageBanners` in `src/lib/admin-data.ts`
5. Add to both `getSiteSettings()` and `updateSiteSettings()` pageBanners merging

### 13. ImagePickerModal in Admin Forms
For event/news edit pages, use `ImagePickerModal` instead of text input for image URLs:

```tsx
import ImagePickerModal from "@/components/admin/ImagePickerModal";

const [imagePickerOpen, setImagePickerOpen] = useState(false);

// In the form:
<div className="relative h-40 bg-gray-100 rounded-lg">
  {formData.imageUrl ? (
    <img src={formData.imageUrl} className="w-full h-full object-cover" />
  ) : (
    <div className="flex items-center justify-center h-full">
      <span>No image selected</span>
    </div>
  )}
</div>
<button onClick={() => setImagePickerOpen(true)}>Select Image</button>

<ImagePickerModal
  isOpen={imagePickerOpen}
  onClose={() => setImagePickerOpen(false)}
  onSelect={(url) => setFormData({ ...formData, imageUrl: url })}
  title="Select Image"
  currentImage={formData.imageUrl}
/>
```

### 14. Adding New Image Types to Branding Page

When adding a new type of image to the admin branding system (e.g., `chorusCardImages`), you must update **multiple locations** in `src/app/admin/branding/page.tsx`:

1. **`PickerState` interface** - Add the new type to the `type` union:
   ```typescript
   interface PickerState {
     type: "logo" | "banner" | "splash" | "heroSlide" | "chorusCard"; // Add here
     // ...
   }
   ```

2. **`handleImageSelect()`** - Add a case for saving the new image type:
   ```typescript
   } else if (type === "chorusCard") {
     newSettings = {
       ...settings,
       chorusCardImages: { ...settings.chorusCardImages, [chorus]: imageUrl },
     };
   }
   ```

3. **`getCurrentImage()`** - Add a case to retrieve the current image:
   ```typescript
   case "chorusCard":
     return settings.chorusCardImages?.[chorus];
   ```

4. **`getPickerTitle()`** - Add a case for the modal title:
   ```typescript
   case "chorusCard":
     return `Select ${chorusName} Card Image`;
   ```

5. **`getUploadConfig()`** - Add entries to all three maps (`nameMap`, `altMap`, `categoryMap`):
   ```typescript
   const nameMap = {
     // ...existing entries
     chorusCard: `${chorus}-chorus-card`,
   };
   ```

**Also update `src/types/admin.ts`** and **`src/lib/admin-data.ts`** per gotcha #10.

### 15. Admin Fields Should Match Display Structure

When creating admin editing fields, match the visual structure of the public page. If content displays as a single text block on the site, use a single textarea in the admin - don't split into multiple fields (e.g., "intro" and "detail").

**Bad approach:**
```typescript
// Two separate fields that display as one continuous block
{ key: "storyIntro_harmony", label: "Story Intro", type: "textarea" },
{ key: "storyDetail_harmony", label: "Story Detail", type: "textarea" },
```

**Good approach:**
```typescript
// Single field with paragraph support (users separate with blank lines)
{ key: "story_harmony", label: "Our Story", type: "textarea" },
```

**Why this matters:**
- Reduces confusion for admins who see the final output as one block
- Simpler data model and fewer fields to maintain
- Users can naturally add paragraphs by pressing Enter twice

**For multi-paragraph support**, split on `\n\n` when rendering:
```tsx
{text.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
```

### 16. ImagePickerModal Requires uploadConfig for Upload Tab

The `ImagePickerModal` component only shows the "Upload New" tab when the `uploadConfig` prop is provided. Without it, users can only select from existing images in the library.

**Without uploadConfig (library only):**
```tsx
<ImagePickerModal
  isOpen={isOpen}
  onClose={onClose}
  onSelect={onSelect}
  title="Select Image"
  currentImage={currentImage}
/>
// Only shows "Image Library" tab
```

**With uploadConfig (library + upload):**
```tsx
<ImagePickerModal
  isOpen={isOpen}
  onClose={onClose}
  onSelect={onSelect}
  title="Select Image"
  currentImage={currentImage}
  uploadConfig={{
    name: "image-name",           // Used for uploaded file naming
    category: "other",            // Image category for organization
    alt: "Image description",     // Alt text for accessibility
    chorus: "voices",             // Chorus association
    processImage: async (file) => file,  // Optional image processor
  }}
/>
// Shows both "Image Library" and "Upload New" tabs
```

**When to include uploadConfig:**
- Any image picker where users should be able to upload new images
- Leadership member photos, event images, news article images
- All branding page image pickers already include this

### 17. Banner-Only Admin Tabs

For pages where only the banner image needs to be editable (not page text content), set an empty `fields` array in `PAGE_CONTENT_SCHEMA`. The `PageContentTab` component automatically hides the "Page Content" section when there are no fields.

```typescript
// In src/types/admin.ts
export const PAGE_CONTENT_SCHEMA = {
  // Pages with editable content
  home: { fields: [...] },
  about: { fields: [...] },

  // Banner-only pages (empty fields = no content section)
  events: { fields: [] },
  media: { fields: [] },
  contact: { fields: [] },
};
```

This approach keeps the code DRY - no need for separate "banner-only" components.

### 18. Chorus Filtering: Pre-Select vs Hide

When implementing chorus-based content filtering, **pre-select the filter** based on the user's chorus choice rather than **hiding** content from other choruses.

**Wrong approach (hides content):**
```tsx
// This permanently hides content from other choruses
const filteredVideos = videos.filter(video =>
  shouldShowForChorus(video.chorus, selectedChorus)
);
```

**Correct approach (pre-selects filter):**
```tsx
// Pre-select filter based on chorus, but let user change it
const getInitialFilter = (chorus: string) => {
  if (chorus === "harmony") return "harmony";
  if (chorus === "melody") return "melody";
  return "all"; // "voices" shows all by default
};

const [filter, setFilter] = useState(() => getInitialFilter(selectedChorus));

// Update when chorus changes
useEffect(() => {
  setFilter(getInitialFilter(selectedChorus));
}, [selectedChorus]);

// Filter only by user-selected UI filter
const filteredVideos = videos.filter(video => {
  if (filter === "all") return true;
  return video.chorus === filter || video.chorus === "voices";
});
```

**Why this matters:**
- Users who select "Harmony" expect to see Harmony content first, but should be able to browse Melody content too
- The chorus selection sets a **default view**, not a **restriction**
- All content remains accessible via filter buttons

**Applied to:** Media page, Events page, News page (shows all with badges)

### 19. Adding Non-Chorus Image Types to Branding

Most image types in the branding system are keyed by chorus (`harmony`, `melody`, `voices`). However, some images aren't chorus-specific - like gear store images which are the same for all visitors.

**For non-chorus image types:**

1. **Use a different key structure** in `SiteSettings`:
   ```typescript
   // In src/types/admin.ts
   gearStoreImages?: {
     etown?: string;      // Keyed by store ID, not chorus
     cafepress?: string;
   };
   ```

2. **Add a `storeId` (or similar) field to `PickerState`**:
   ```typescript
   interface PickerState {
     // ...existing fields
     storeId?: "etown" | "cafepress";
   }
   ```

3. **Handle the new type in all picker functions**:
   - `openPicker()` - Accept the extra parameter
   - `handleImageSelect()` - Save to correct location using the ID
   - `getCurrentImage()` - Retrieve using ID instead of chorus
   - `getPickerTitle()` - Show appropriate title
   - `getUploadConfig()` - Generate names/alts using ID

4. **Create a custom tab component** (like `GearTab`) that passes the extra parameter:
   ```tsx
   onImageSelect={(type, chorus, page, storeId) =>
     openPicker(type, chorus, page, storeId)
   }
   ```

**Key insight:** The `chorus` parameter is still required by the picker (for upload config), but it's not used for storage. Pass `"voices"` as a placeholder when the image isn't chorus-specific.

### 20. CSS 3D Transforms with Framer Motion

When implementing 3D flip card animations:

1. **Parent needs perspective**:
   ```css
   .perspective-1000 {
     perspective: 1000px;
   }
   ```

2. **Container needs `transformStyle: "preserve-3d"`** for children to exist in 3D space

3. **Both faces need `backfaceVisibility: "hidden"`** to hide when rotated away

4. **Back face must be pre-rotated 180°** with `transform: "rotateY(180deg)"`

5. **Use absolute positioning** so both faces occupy the same space

**Mobile handling:** Use `onTouchStart` to toggle flip state on tap (hover doesn't work on touch devices).

### 21. Resend Free Tier Email Restriction

When using Resend's free tier with the default sender (`onboarding@resend.dev`), you can **only send emails to the email address you signed up with**. Attempting to send to any other address will return a 403 error:

```
validation_error: You can only send testing emails to your own email address
```

**Solutions:**
1. **For testing:** Set `DESTINATION_EMAIL` to your Resend signup email
2. **For production:** Verify your domain in Resend:
   - Go to Resend dashboard → Domains → Add Domain
   - Add the DNS records Resend provides (SPF, DKIM)
   - Once verified, you can send to any email address
   - You can also change the `from` address to use your domain

**Note:** Domain verification requires access to the domain's DNS settings at the registrar.

## Admin Access

- URL: `/admin`
- Password: Check `src/app/api/admin/login/route.ts` for current password
- Session: Stored in cookie (`admin_session`)

### 7. Leadership Management System

Leadership data is stored in Vercel KV and editable via the admin panel.

**Types:**
- `LeadershipMember` - Individual leader with name, title, bio, photo, category, chorusAffiliation
- `LeadershipCategory` - "musicLeadership" | "boardMember" | "boardAtLarge"

**Files:**
- `src/types/admin.ts` - Type definitions
- `src/lib/admin-data.ts` - CRUD functions: `getLeadership()`, `createLeadershipMember()`, `updateLeadershipMember()`, `deleteLeadershipMember()`, `reorderLeadership()`
- `src/app/api/admin/leadership/route.ts` - Admin API for CRUD operations
- `src/app/api/leadership/route.ts` - Public API for reading leadership data
- `src/components/admin/branding/LeadershipTab.tsx` - Admin UI component

**Usage:**
```tsx
// Fetch leadership from API
const response = await fetch("/api/leadership");
const { data } = await response.json();
// data.musicLeadership, data.boardMembers, data.boardAtLarge
```

### 8. Page Content System

Editable text content for all pages (hero titles, subtitles, section titles, etc.).

**Types:**
- `PageContent` - Key-value pairs of editable text for a page
- `AllPageContent` - Record of all page content keyed by PageKey
- `PAGE_CONTENT_SCHEMA` - Defines editable fields for each page

**Files:**
- `src/types/admin.ts` - Type definitions and schema
- `src/lib/admin-data.ts` - `getPageContent()`, `updatePageContent()`
- `src/app/api/admin/page-content/route.ts` - API for managing content

**Adding new editable fields:**
1. Add field to `PAGE_CONTENT_SCHEMA[pageKey].fields` in `src/types/admin.ts`
2. Add default value in `DEFAULT_PAGE_CONTENT` in `src/lib/admin-data.ts`
3. Use in page component: `pageContent.fieldKey`

### 9. Admin Branding & Content Page (Tabbed Interface)

The admin branding page uses a tabbed interface for managing all site content.

**Tabs:**
- **General** - Combined tab for logos, splash page backgrounds, and hero slideshow backgrounds (all per-chorus)
- **Home** - Hero slide banners/descriptions per chorus + "Our Choruses" section (card images and descriptions for Harmony, Melody, Voices)
- **About** - Page banners + "Our Story" section (per-chorus images and text)
- **Leadership** - Leadership member management only (no editable page content)
- **Banner-only tabs** (Join, Events, Media, Contact, Donate, Gear) - Only banner images per chorus; page content is static in code

**Files:**
- `src/app/admin/branding/page.tsx` - Main page with tab logic and image picker handling
- `src/components/admin/branding/AdminTabs.tsx` - Tab navigation component
- `src/components/admin/branding/GeneralTab.tsx` - Combined logos, splash backgrounds, hero slideshow backgrounds
- `src/components/admin/branding/HomeTab.tsx` - Home page specific: hero descriptions + chorus card images/descriptions
- `src/components/admin/branding/AboutTab.tsx` - About page: story images and text per chorus
- `src/components/admin/branding/PageContentTab.tsx` - Reusable page banner editor (content section only shows if schema has fields)
- `src/components/admin/branding/LeadershipTab.tsx` - Leadership member management
- `src/components/admin/branding/GearTab.tsx` - Gear page store images and banners

**Adding a new page tab:**
1. Add to `tabs` array in branding page
2. Add to `pageInfo` object with name, description, icon
3. Add to `PAGE_CONTENT_SCHEMA` in types/admin.ts (empty fields array for banner-only pages)
4. Add default content in `DEFAULT_PAGE_CONTENT` in admin-data.ts (optional for banner-only pages)

### 10. About Page "Our Story" Section

The About page displays per-chorus content that changes based on which chorus the visitor selected.

**Editable content:**
- **Story Image** - One image per chorus (stored in `SiteSettings.aboutStoryImages`)
- **Story Text** - Single text block per chorus with paragraph support (stored in `PageContent.about` with keys `story_harmony`, `story_melody`, `story_voices`)

**Non-editable (hardcoded):**
- Mission & Values section
- Our Achievements section
- Our Commitment to Inclusion section
- "Join our Harmony/Melody/Voices" CTA (dynamic based on chorus selection)

**Files:**
- `src/app/(site)/about/page.tsx` - Public About page that fetches and displays content
- `src/components/admin/branding/AboutTab.tsx` - Admin UI for editing story images and text

**How paragraph rendering works:**
The story text supports multiple paragraphs. Users separate paragraphs with blank lines in the textarea, and the page splits on `\n\n` to render each as a `<p>` tag:
```tsx
{storyText.split('\n\n').map((paragraph, index) => (
  <p key={index}>{paragraph}</p>
))}
```

### 11. Home Page "Our Choruses" Section

The home page displays three chorus cards (Harmony, Melody, Voices) with editable images and descriptions.

**Files:**
- `src/components/home/ChorusesSection.tsx` - Client component that fetches and displays chorus cards
- `src/components/admin/branding/HomeTab.tsx` - Admin UI for editing card images and descriptions

**Data sources:**
- Card images: Stored in `SiteSettings.chorusCardImages` (fetched from `/api/admin/site-settings`)
- Card descriptions: Stored in `PageContent.home` with keys `chorusCard_harmony`, `chorusCard_melody`, `chorusCard_voices`

**How it works:**
1. `ChorusesSection` fetches both page content and site settings on mount
2. Images fall back to defaults (`/images/harmony-bg.jpg`, etc.) if not set
3. Descriptions fall back to hardcoded defaults in the component
4. Admin edits images via ImagePickerModal, descriptions via textarea

### 12. Gear Shop System

The gear page links to two external merchandise stores with flip card animations.

**External Stores (hardcoded URLs):**
- **eTown Sporting Goods** (Chipply): https://etownsportinggoods.chipply.com/ParksideHarmony/
- **CafePress**: https://www.cafepress.com/shop/ParksideGear

**Files:**
- `src/app/(site)/gear/page.tsx` - Public gear page with flip cards
- `src/components/admin/branding/GearTab.tsx` - Admin UI for gear settings

**Data sources:**
- Page banners: `SiteSettings.pageBanners.gear` (per-chorus like other pages)
- Store card images: `SiteSettings.gearStoreImages.etown` and `.cafepress`

**How the flip cards work:**
1. Front shows merchandise image with store name overlay
2. On hover (desktop) or tap (mobile), card flips 180° using Framer Motion
3. Back shows store description and "Shop Now" button
4. Button opens external store in new tab

**Implementation details:**
```tsx
// Framer Motion 3D flip animation
<motion.div
  animate={{ rotateY: isFlipped ? 180 : 0 }}
  transition={{ duration: 0.6, ease: "easeInOut" }}
  style={{ transformStyle: "preserve-3d" }}
>
  {/* Front face */}
  <div style={{ backfaceVisibility: "hidden" }}>...</div>
  {/* Back face - rotated 180° */}
  <div style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>...</div>
</motion.div>
```

**CSS requirement:**
```css
.perspective-1000 {
  perspective: 1000px;
}
```

**Admin controls:**
- Per-chorus banner images (same as other pages)
- Two store image pickers (not per-chorus - same for all visitors)

**Why store URLs are hardcoded:**
Neither Chipply nor CafePress offer public APIs for embedding store content. The URLs rarely change, so they're hardcoded rather than admin-editable to avoid accidental breakage.

## Key Files Quick Reference

| Purpose | File |
|---------|------|
| Chorus context | `src/lib/chorus-context.tsx` |
| Admin data functions | `src/lib/admin-data.ts` |
| Type definitions | `src/types/admin.ts` |
| Page banner hook | `src/hooks/usePageBanner.ts` |
| Site settings API | `src/app/api/admin/site-settings/route.ts` |
| Header/Logo | `src/components/layout/Header.tsx` |
| Branding admin | `src/app/admin/branding/page.tsx` |
| Admin tabs component | `src/components/admin/branding/AdminTabs.tsx` |
| General tab (logos/splash/hero) | `src/components/admin/branding/GeneralTab.tsx` |
| Home tab (chorus cards) | `src/components/admin/branding/HomeTab.tsx` |
| About tab (story images/text) | `src/components/admin/branding/AboutTab.tsx` |
| Page content tab | `src/components/admin/branding/PageContentTab.tsx` |
| Leadership tab | `src/components/admin/branding/LeadershipTab.tsx` |
| Image picker modal | `src/components/admin/ImagePickerModal.tsx` |
| Image edit page | `src/app/admin/images/[id]/edit/page.tsx` |
| Images API | `src/app/api/admin/images/route.ts` |
| Splash page (mobile carousel) | `src/components/splash/SplitScreen.tsx` |
| Hero slideshow | `src/components/home/HeroSlideshow.tsx` |
| Our Choruses section | `src/components/home/ChorusesSection.tsx` |
| About page | `src/app/(site)/about/page.tsx` |
| Events list component | `src/components/events/EventsList.tsx` |
| Events public API | `src/app/api/events/route.ts` |
| Events sync API | `src/app/api/admin/events/sync/route.ts` |
| Events sync button | `src/components/admin/SyncEventsButton.tsx` |
| News list component | `src/components/news/NewsList.tsx` |
| News public API | `src/app/api/news/route.ts` |
| News sync API | `src/app/api/admin/news/sync/route.ts` |
| News sync button | `src/components/admin/SyncNewsButton.tsx` |
| Media page (public) | `src/app/(site)/media/page.tsx` |
| Videos admin list | `src/app/admin/videos/page.tsx` |
| Add video page | `src/app/admin/videos/new/page.tsx` |
| Edit video page | `src/app/admin/videos/[id]/edit/page.tsx` |
| Videos public API | `src/app/api/videos/route.ts` |
| Videos admin API | `src/app/api/admin/videos/route.ts` |
| YouTube metadata API | `src/app/api/admin/youtube-metadata/route.ts` |
| Leadership API (admin) | `src/app/api/admin/leadership/route.ts` |
| Leadership API (public) | `src/app/api/leadership/route.ts` |
| Page content API | `src/app/api/admin/page-content/route.ts` |
| Gear page (public) | `src/app/(site)/gear/page.tsx` |
| Gear tab (admin) | `src/components/admin/branding/GearTab.tsx` |
| Contact page (public) | `src/app/(site)/contact/page.tsx` |
| Contact form API (Resend) | `src/app/api/contact/route.ts` |

## Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
```

## Data Directory

The `/data/` directory contains JSON files that act as the "database". These are gitignored in some setups. Key files:
- `events.json`
- `news.json`
- `images.json`
- `videos.json`
- `site-settings.json`

If starting fresh, the admin panel will create these files with defaults.

## Future Considerations

1. **Resend Domain Verification**: Verify `parksideharmony.org` in Resend to send emails FROM the domain and TO any address (currently limited to Resend signup email)
2. **FAQ & Privacy Policy Pages**: Links exist in footer but pages not yet created
3. **Database**: Could migrate from JSON files to a proper database for scale
4. **Image CDN**: Consider using a dedicated image CDN for better performance

## Security Notes

### Authentication Architecture
- Uses NextAuth.js v5 with Google/GitHub OAuth
- Admin access controlled by email allowlist stored in Vercel KV (`admin:emails`)
- Middleware protects `/admin/*` and `/api/admin/*` routes
- Each API route also checks `session?.user?.isAdmin` for defense-in-depth

### Intentionally Public Endpoints
- `GET /api/site-settings` - Returns non-sensitive config (banners, images) for frontend use
- `GET /api/page-content` - Returns page content for public display
- `GET /api/leadership` - Public leadership API for the leadership page

### Security Review History
- January 2026: Pre-launch security audit completed
  - Dependencies audited and vulnerabilities fixed
  - Secrets/environment variables verified
  - Authentication flow reviewed
  - API route authorization verified
  - See GitHub issues tagged `security` for planned improvements
