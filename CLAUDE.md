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
2. **Image Uploads**: Currently references existing images; could add upload functionality
3. **Database**: Could migrate from JSON files to a proper database for scale
4. **Authentication**: Current admin auth is basic; could upgrade to NextAuth.js
