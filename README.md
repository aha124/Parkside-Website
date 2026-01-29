# Parkside Website

A modern website for Parkside featuring a split-screen landing page and a clean, responsive design.

## Features

### Splash Page
- Split-screen landing page with two sides: "Parkside Harmony" and "Parkside Melody"
- Interactive hover effects with smooth animations
- Background image zoom/pan animations on hover
- Center logo with zoom animation that links to the main website

### Main Website
- Clean, modern design with intuitive navigation
- Responsive navigation bar with mobile menu
- Hero section with background image
- Featured events section with cards
- Recent news section with article previews
- Fully responsive design for all devices

### Automated Content Updates
- Automatic fetching of news articles from the Parkside Harmony website
- Automatic fetching of events from the Parkside Harmony website
- GitHub Actions workflow to keep content up-to-date
- Daily updates and manual trigger options

## Tech Stack

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Reusable UI components
- **Framer Motion**: Animation library
- **GitHub Actions**: Automated workflows for content updates

## Getting Started

### Prerequisites

- Node.js 18.17 or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/parkside-website.git
cd parkside-website
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

- `src/app`: Next.js app router pages
  - `(site)`: Public-facing pages
  - `admin`: Admin dashboard for content management
  - `api`: API routes for data and admin operations
- `src/components`: Reusable React components
  - `layout`: Layout components (Header, Footer)
  - `splash`: Components for the splash page
  - `ui`: UI components from Shadcn UI
  - `events`: Event display components
- `src/lib`: Utility functions and data management
  - `admin-data.ts`: Admin content operations (Vercel KV)
- `public`: Static assets like images and scraped data
- `scripts`: Utility scripts for content updates
  - `syncEvents.js`: Sync events from Parkside Harmony website
- `.github/workflows`: GitHub Actions workflow configurations

## Content Management

The website uses a **dual-storage architecture** for events:

### Scraped Events (Automated)
- **Source**: https://parksideharmony.org/events (Groupanizer)
- **Storage**: `public/data/events.json`
- **Sync**: Automatically synced daily at midnight via GitHub Actions
- **Script**: `scripts/syncEvents.js`
- Events are completely replaced on each sync to reflect source changes (additions AND deletions)
- Old events (180+ days) are automatically filtered out

### Manual Events (Admin-Created)
- **Source**: Admin dashboard at `/admin/events`
- **Storage**: Vercel KV database (`admin:event-overrides`)
- **Management**: Create, edit, and delete via admin panel
- These events persist independently of the automated sync

### Event Display
Events are merged at runtime via `/api/events`:
1. Scraped events are loaded from `events.json`
2. Manual events are fetched from Vercel KV
3. Manual events can override scraped events by matching `originalId`
4. Combined list is sorted by date and displayed

### News Management
- **All news is managed through the admin dashboard** at `/admin/news`
- Stored in Vercel KV database
- No automated scraping (deprecated)

### Sync Schedule
- **Automated**: Daily at midnight UTC via GitHub Actions
- **Manual**: Trigger sync from admin dashboard or GitHub Actions tab
- **On-Demand**: Run `node scripts/syncEvents.js` locally

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspiration from modern split-screen layouts
- Shadcn UI for the component system
- Next.js team for the amazing framework
