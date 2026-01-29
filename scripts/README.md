# Parkside Website Scripts

This directory contains utility scripts for the Parkside Website.

## Active Scripts

### syncEvents.js
**Primary event sync script** - Syncs events from parksideharmony.org/events (Groupanizer).

**Usage:**
```bash
node scripts/syncEvents.js
```

**What it does:**
- Fetches current events from https://parksideharmony.org/events
- Parses event data (title, date, time, location, chorus)
- **Replaces** `public/data/events.json` with current source data
- Filters out events older than 180 days
- Handles event deletions automatically (source is truth)

**Automated:**
- Runs daily at midnight UTC via GitHub Actions
- Can be triggered manually from admin panel or GitHub Actions tab

**Note:** Manual events created in the admin panel are stored separately in Vercel KV and are not affected by this sync.

## Utility Scripts

### parseEventsHtml.js
Parses HTML content from the events page. Used as a utility for testing.

### scrapeEventsSimple.js
A simplified version of events scraping using fetch + cheerio (no puppeteer).

### fetchChoirGeniusEvents.js
Legacy script for fetching events from ChoirGenius API (deprecated).

### generate-news-images.js / generate-placeholder-images.js
Utility scripts for generating placeholder images.

## Content Management Architecture

### Events
- **Scraped events**: Automated via `syncEvents.js` → `public/data/events.json`
- **Manual events**: Admin panel → Vercel KV database
- **Display**: Merged at runtime via `/api/events`

### News
- **All news is managed through the admin dashboard** at `/admin/news`
- Stored in Vercel KV database
- No automated scraping

## Removed Scripts

The following scripts were removed:
- `scrapeEventsPage.js` - Used puppeteer (replaced by syncEvents.js + admin sync)
- `scrapeNewsPage.js` - Used puppeteer (replaced by admin panel)
- `fetch-news.js` - Used jsdom (replaced by admin panel)
