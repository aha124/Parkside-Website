# Technical Documentation: Parkside Website

## 1. Technology Stack

*   **Framework:** Next.js (^15.2.1) - App Router
*   **Language:** TypeScript (^5)
*   **UI Library:** React (^19.0.0)
*   **Styling:** Tailwind CSS (^4) with PostCSS
    *   Utilities: `clsx`, `tailwind-merge`, `tailwindcss-animate`
*   **Linting:** ESLint (^9) with `eslint-config-next`
*   **Package Manager:** npm (inferred from `package-lock.json`)
*   **Animations:** Framer Motion (^12.5.0)
*   **Data Fetching/Manipulation (Potential):** `cheerio`, `jsdom`, `puppeteer`, `playwright` (found in `package.json`, possibly for `scripts/fetch-news.js`)
*   **Utilities:** `date-fns` (date formatting), `lucide-react` (icons), `uuid` (unique IDs), `@radix-ui/react-slot` (component composition)

## 2. Development Environment Setup

1.  **Prerequisites:** Node.js and npm installed.
2.  **Clone Repository:** `git clone <repository-url>`
3.  **Install Dependencies:** `npm install`
4.  **Run Development Server:** `npm run dev` (Uses Turbopack)
    *   Access at `http://localhost:3000` (default)

## 3. Build and Deployment

*   **Build:** `npm run build`
*   **Start Production Server:** `npm run start`
*   **Deployment Platform:** Vercel
*   **Scheduled Tasks:** Vercel Cron Jobs configured in `vercel.json` trigger API routes (`/api/cron/*`) daily to update news and events data.

## 4. Key Technical Decisions & Patterns (Initial Observation)

*   **Next.js App Router:** Leverages Server Components and file-system based routing.
*   **TypeScript:** For static typing and improved developer experience.
*   **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
*   **Component-Based Architecture:** UI broken down into reusable components (`src/components`).
*   **Static Data:** Some data (`events.json`) is stored directly in the repository.
*   **Scripted Data Fetching:** News and Events data are fetched/scraped via Node.js scripts (`scripts/fetch-news.js`, `scripts/fetchChoirGeniusEvents.js`) triggered by API routes invoked by Vercel Cron jobs.
*   **API Routes:** Used as targets for Vercel Cron jobs to initiate data fetching scripts.

## 5. Scripts

*   `dev`: Starts the development server with Turbopack.
*   `build`: Creates an optimized production build.
*   `start`: Runs the production server.
*   `lint`: Lints the codebase using ESLint.
*   `fetch-news`: Executes `scripts/fetch-news.js` (scrapes news, saves to `/public/data/news.json`). Now triggered via `/api/cron/fetch-news`.
*   `fetchChoirGeniusEvents`: Executes `scripts/fetchChoirGeniusEvents.js` (fetches events from ChoirGenius, saves to `/public/data/events.json`). Requires `CHOIR_GENIUS_USERNAME`, `CHOIR_GENIUS_PASSWORD` env vars. Now triggered via `/api/cron/fetch-events`.

## 6. Configuration Files

*   `next.config.ts`: Next.js configuration.
*   `tailwind.config.ts`: Tailwind CSS configuration.
*   `tsconfig.json`: TypeScript configuration.
*   `postcss.config.mjs`: PostCSS configuration.
*   `eslint.config.mjs`: ESLint configuration.
*   `components.json`: Potentially related to shadcn/ui or a similar component library setup.
*   `vercel.json`: Configures Vercel deployment settings, including Cron Jobs.

## 7. Open Questions

*   Details of the `fetch-news.js` implementation (Mostly understood now).
*   Specific hosting/deployment environment and CI/CD setup (Vercel, using Cron Jobs).
*   Is `components.json` used for shadcn/ui? If so, are there CLI commands associated with it?
*   Should pages using news/events data be revalidated after cron job execution? 