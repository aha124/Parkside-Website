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
- `src/components`: Reusable React components
  - `layout`: Layout components (Header, Footer)
  - `splash`: Components for the splash page
  - `ui`: UI components from Shadcn UI
- `public`: Static assets like images
- `scripts`: Utility scripts for content updates
  - `fetch-news.js`: Script to fetch news from the Parkside Harmony website
  - `scrapeEventsPage.js`: Script to fetch events from the Parkside Harmony website
- `.github/workflows`: GitHub Actions workflow configurations

## Automated Content Updates

The website uses GitHub Actions to automatically fetch and update content from the Parkside Harmony website:

### News Updates
- News articles are fetched from https://parksideharmony.org/news
- The script extracts titles, dates, summaries, images, and URLs
- Updates are saved to `public/data/news.json`

### Event Updates
- Events are fetched from https://parksideharmony.org/events
- The script extracts event details, dates, locations, and images
- Updates are saved to `public/data/events.json`

### Update Schedule
- Updates run automatically every day at midnight
- Updates also run when the scripts are modified
- Manual updates can be triggered from the GitHub Actions tab

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspiration from modern split-screen layouts
- Shadcn UI for the component system
- Next.js team for the amazing framework
