# System Architecture: Parkside Website

## 1. Overview

This document describes the architecture of the Parkside website, built using the Next.js framework.

## 2. Key Components (Initial Observation)

```mermaid
graph TD
    A[Client Browser] --> B(Next.js Frontend - React/TypeScript)
    B --> C{Next.js Server}
    C --> D[API Routes]
    C --> E[Static Site Generation / Server-Side Rendering]
    E --> F[(Static Assets - /public)]
    E --> G[Page Components - src/app]
    G --> H[UI Components - src/components]
    I{Data Sources} --> J[/public/data/events.json]
    I --> K[/public/data/news.json]
    L(External: parksideharmony.org/news) --> M(scripts/fetch-news.js)
    N(External: ChoirGenius API) --> O(scripts/fetchChoirGeniusEvents.js)
    P[Vercel Cron Jobs] --> D
    D -- triggers --> M
    D -- triggers --> O
    M -- writes --> K
    O -- writes --> J
    
    subgraph NextApp [Next.js Application]
        B
        C
        D(API Routes:
          /api/cron/fetch-news
          /api/cron/fetch-events
        )
        E
        G
        H
    end

    subgraph DataPersistence
        J
        K
    end
```

*   **Frontend:** Built with React, TypeScript, and Tailwind CSS, utilizing Next.js App Router.
*   **Backend/Server:** Handled by Next.js (Server Components, API Routes).
*   **Data:**
    *   Events data sourced from ChoirGenius via `scripts/fetchChoirGeniusEvents.js`, stored in `/public/data/events.json`.
    *   News data scraped from `parksideharmony.org/news` via `scripts/fetch-news.js`, stored in `/public/data/news.json`.
*   **Scheduled Tasks (Vercel Cron):**
    *   Daily job triggers `/api/cron/fetch-news` to run `fetch-news.js`.
    *   Daily job triggers `/api/cron/fetch-events` to run `fetchChoirGeniusEvents.js`.
*   **Styling:** Tailwind CSS with `clsx` and `tailwind-merge`.
*   **Animations:** Framer Motion (`framer-motion`) and custom scroll animations (`ScrollAnimation`).
*   **UI Components:** Reusable components located in `src/components`.
*   **Routing:** Handled by Next.js App Router (directory structure within `src/app`).

## 3. Dependencies & Relationships

*   Pages (`src/app/(site)/*`) depend on UI components (`src/components/*`).
*   Components like `EventsList` and `NewsList` fetch or receive data.
*   `HeroSlideshow` manages image display.
*   `PageTransition` likely handles route change animations.

## 4. Data Flow (Example: Events)

1.  User visits a page containing `<EventsList>`.
2.  The `EventsList` component (potentially a Server Component) fetches data from `/data/events.json` during build time (SSG) or request time (SSR/ISR).
3.  The component renders the event data.

## 5. Open Questions / Areas for Detail

*   Use of API routes (Now: Used for Cron Triggers).
*   Deployment strategy (Vercel detected, using Cron Jobs).
*   State management approach (if complex state arises).
*   Need for page revalidation after cron jobs run? 