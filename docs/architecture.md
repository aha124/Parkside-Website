# System Architecture: Parkside Website

## 1. Overview

This document describes the architecture of the Parkside website, built using the Next.js framework.

## 2. Key Components (Initial Observation)

```mermaid
graph TD
    A[Client Browser] --> B(Next.js Frontend - React/TypeScript)
    B --> C{Next.js Server}
    C --> D[API Routes (Potentially for data fetching)]
    C --> E[Static Site Generation / Server-Side Rendering]
    E --> F[(Static Assets - /public)]
    E --> G[Page Components - src/app]
    G --> H[UI Components - src/components]
    D --> I{Data Sources}
    I --> J[/data/events.json]
    I --> K[/scripts/fetch-news.js -> External Source?]

    subgraph NextApp [Next.js Application]
        B
        C
        D
        E
        G
        H
    end
```

*   **Frontend:** Built with React, TypeScript, and Tailwind CSS, utilizing Next.js App Router.
*   **Backend/Server:** Handled by Next.js (Server Components, API Routes if used).
*   **Data:**
    *   Events data seems to be sourced from a static JSON file (`/data/events.json`).
    *   News data appears to be fetched via a script (`scripts/fetch-news.js`), potentially scraping or pulling from an external source.
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

*   Exact mechanism and source for the `fetch-news.js` script.
*   Use of API routes (if any).
*   Deployment strategy.
*   State management approach (if complex state arises). 