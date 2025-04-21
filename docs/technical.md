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
*   **Deployment Platform:** (Not specified - Vercel is common for Next.js)

## 4. Key Technical Decisions & Patterns (Initial Observation)

*   **Next.js App Router:** Leverages Server Components and file-system based routing.
*   **TypeScript:** For static typing and improved developer experience.
*   **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
*   **Component-Based Architecture:** UI broken down into reusable components (`src/components`).
*   **Static Data:** Some data (`events.json`) is stored directly in the repository.
*   **Scripted Data Fetching:** News seems to be fetched via a separate Node.js script.

## 5. Scripts

*   `dev`: Starts the development server with Turbopack.
*   `build`: Creates an optimized production build.
*   `start`: Runs the production server.
*   `lint`: Lints the codebase using ESLint.
*   `fetch-news`: Executes `scripts/fetch-news.js` (purpose likely to update news data).

## 6. Configuration Files

*   `next.config.ts`: Next.js configuration.
*   `tailwind.config.ts`: Tailwind CSS configuration.
*   `tsconfig.json`: TypeScript configuration.
*   `postcss.config.mjs`: PostCSS configuration.
*   `eslint.config.mjs`: ESLint configuration.
*   `components.json`: Potentially related to shadcn/ui or a similar component library setup.

## 7. Open Questions

*   Details of the `fetch-news.js` implementation.
*   Specific hosting/deployment environment and CI/CD setup.
*   Is `components.json` used for shadcn/ui? If so, are there CLI commands associated with it? 