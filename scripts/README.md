# Parkside Website Scripts

This directory contains utility scripts for the Parkside Website.

## Events and News Syncing

**Events and news syncing is now handled through the admin panel.** Use the "Sync Events" and "Sync News" buttons in the admin dashboard instead of running scripts manually.

The admin sync functionality:
- Uses `fetch()` + cheerio (lightweight, no browser automation needed)
- Performs delta checking to only add new items
- Automatically cleans up old events (180+ days)
- Provides feedback in the admin UI

## Remaining Scripts

### parseEventsHtml.js
Parses HTML content from the events page. Used as a utility for testing.

### scrapeEventsSimple.js
A simplified version of events scraping using fetch + cheerio (no puppeteer).

### fetchChoirGeniusEvents.js
Legacy script for fetching events from ChoirGenius API (deprecated).

### generate-news-images.js / generate-placeholder-images.js
Utility scripts for generating placeholder images.

## Removed Scripts

The following scripts were removed as they are superseded by admin panel functionality:
- `scrapeEventsPage.js` - Used puppeteer (replaced by admin sync)
- `scrapeNewsPage.js` - Used puppeteer (replaced by admin sync)
- `fetch-news.js` - Used jsdom (replaced by admin sync)
