# Events Integration for Parkside Website

This directory contains scripts for integrating events from your Parkside Harmony website into your new Parkside website.

## Overview

The integration works by:

1. Scraping events directly from the public events page at parksideharmony.org/events
2. Converting the events to the format used by the website
3. Updating the JSON file that powers the events display

## Web Scraping Approach

We've switched to a direct web scraping approach that:

1. Uses Puppeteer to load the events page in a headless browser
2. Extracts event information from the HTML using Cheerio
3. Formats the data to match our website's requirements
4. Falls back to dummy events if no events are found or if there's an error

This approach is more reliable than the previous ChoirGenius API library because:
- It doesn't require authentication credentials
- It uses the same data that's already publicly displayed on your website
- It's not dependent on the internal structure of ChoirGenius

## Setup Instructions

### Manual Setup

To run the script manually:

1. Install the required dependencies:
   ```bash
   npm install puppeteer cheerio uuid
   ```

2. Run the script:
   ```bash
   node scripts/scrapeEventsPage.js
   ```

### Automated Setup with GitHub Actions

For automatic updates using GitHub Actions:

1. Push your code to GitHub

2. The GitHub Actions workflow will:
   - Run automatically every day at midnight
   - Run when you push changes to the script
   - Allow manual triggering from the Actions tab

## Customization

### Event Images

The script assigns default images to events based on which chorus they belong to. You can customize these by:

1. Adding appropriate images to the `/public/images/` directory
2. Updating the `DEFAULT_IMAGES` object in the script

### Chorus Detection

The script determines which chorus an event belongs to by looking for keywords in the event title and description. You can customize this logic in the `determineChorus` function.

### Dummy Events

If no events are found on the website, the script will create dummy events to ensure the website always has content to display. You can customize these dummy events by modifying the `createDummyEvents` function.

## Troubleshooting

If you encounter issues:

- **Scraping Errors**: If the structure of the events page changes, you may need to update the selectors in the `scrapeEvents` function
- **Date Parsing Errors**: If the date format on the events page changes, you may need to update the regex in the `parseDateTime` function
- **No Events Found**: The script will automatically create dummy events if none are found
- **Script Errors**: The script is designed to handle errors gracefully and will create dummy events if anything goes wrong

## Resources

- [Puppeteer Documentation](https://pptr.dev/)
- [Cheerio Documentation](https://cheerio.js.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions) 