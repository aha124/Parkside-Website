# Parkside Website - Developer Guide

This document provides context for AI assistants and developers working on this codebase.

## Project Overview

This is a Next.js 14+ website for **Parkside Barbershop** - a barbershop organization with two choruses:
- **Parkside Harmony** - Men's chorus (TTBB)
- **Parkside Melody** - Women's chorus (SSAA)

The site dynamically changes content based on which chorus the visitor selects.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion (drag gestures, transitions, animations)
- **Data Storage**: JSON files in `/data/` directory (no database)
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

### 2. Admin Data System

All admin data is stored as JSON files in `/data/`:
- `events.json` - Events/performances
- `news.json` - News articles
- `images.json` - Image metadata for tagging
- `videos.json` - YouTube video data
- `site-settings.json` - Site branding (logos, banners)

**Key file:** `src/lib/admin-data.ts` - Contains all CRUD functions for admin data.

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
- `/api/events` - CRUD for events
- `/api/news` - CRUD for news
- `/api/images` - Image metadata
- `/api/videos` - Video management
- `/api/admin/site-settings` - Site branding
- `/api/admin/images/seed` - Seeds existing repo images to admin
- `/api/contact` - Contact form submissions

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

### 6. Form Submissions
Contact form posts to `/api/contact` which currently logs submissions. To enable actual email sending, integrate a service like SendGrid, Resend, or Nodemailer.

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

## Admin Access

- URL: `/admin`
- Password: Check `src/app/api/admin/login/route.ts` for current password
- Session: Stored in cookie (`admin_session`)

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
| Image picker modal | `src/components/admin/ImagePickerModal.tsx` |
| Image edit page | `src/app/admin/images/[id]/edit/page.tsx` |
| Images API | `src/app/api/admin/images/route.ts` |
| Splash page (mobile carousel) | `src/components/splash/SplitScreen.tsx` |
| Hero slideshow | `src/components/home/HeroSlideshow.tsx` |

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

1. **Email Integration**: Contact form needs email service integration
2. **Database**: Could migrate from JSON files to a proper database for scale
3. **Authentication**: Current admin auth is basic; could upgrade to NextAuth.js
4. **Image CDN**: Consider using a dedicated image CDN for better performance
