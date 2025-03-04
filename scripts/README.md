# ChoirGenius Integration for Parkside Website

This directory contains scripts for integrating events from your ChoirGenius Groupanizer account with the Parkside website.

## Overview

The integration works by:

1. Fetching events from ChoirGenius using an unofficial API library
2. Converting the events to the format used by the website
3. Updating the JSON file that powers the events display

## Important Note About the ChoirGenius Library

The unofficial ChoirGenius library we're using has some limitations:

- It doesn't have a direct `getEvents` method as initially expected
- The script now tries multiple approaches to fetch events:
  1. First tries `getCalendarEvents` if available
  2. Then tries `getUpcomingEvents` if available
  3. Falls back to a custom scraping function
  4. If no events are found, creates dummy events for testing

This ensures the integration is resilient to changes in the library or website structure.

## Setup Instructions

### Manual Setup

To run the script manually:

1. Install the required dependencies:
   ```bash
   npm install github:hcamusic/choirgenius uuid
   ```

2. Set your ChoirGenius credentials as environment variables:
   ```bash
   # On Windows
   set CHOIR_GENIUS_USERNAME=your_username
   set CHOIR_GENIUS_PASSWORD=your_password
   
   # On macOS/Linux
   export CHOIR_GENIUS_USERNAME=your_username
   export CHOIR_GENIUS_PASSWORD=your_password
   ```

3. The script is already configured to use the Parkside Harmony custom domain (https://parksideharmony.org). If you need to change this for any reason, update the `CHOIR_GENIUS_URL` in `fetchChoirGeniusEvents.js`.

4. Run the script:
   ```bash
   node scripts/fetchChoirGeniusEvents.js
   ```

### Automated Setup with GitHub Actions

For automatic updates using GitHub Actions:

1. Push your code to GitHub

2. Add your ChoirGenius credentials as GitHub Secrets:
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Add two new repository secrets:
     - `CHOIR_GENIUS_USERNAME`: Your ChoirGenius username
     - `CHOIR_GENIUS_PASSWORD`: Your ChoirGenius password

3. The GitHub Actions workflow will:
   - Run automatically every day at midnight
   - Run when you push changes to the script
   - Allow manual triggering from the Actions tab

## Customization

### Event Images

The script assigns default images to events based on which chorus they belong to. You can customize these by:

1. Adding appropriate images to the `/public/images/` directory
2. Updating the `DEFAULT_IMAGES` object in the script

### Chorus Detection

The script determines which chorus an event belongs to by looking for keywords in the event title and description. You can customize these keywords by modifying the `harmonyKeywords` and `melodyKeywords` arrays in the `determineChorus` function.

### Dummy Events

If no events are found in ChoirGenius, the script will create dummy events to ensure the website always has content to display. You can customize these dummy events in the `main` function.

## Troubleshooting

If you encounter issues:

- **Login Failures**: Ensure your username and password are correct
- **No Events Found**: Check that your ChoirGenius account has upcoming events. The script will create dummy events if none are found.
- **Script Errors**: The unofficial API may break if ChoirGenius changes their website structure. Check for updates to the library.
- **URL Issues**: If the login URL changes, update the `CHOIR_GENIUS_URL` in the script
- **Library Method Issues**: If you see errors about missing methods, the library may have changed. The script tries multiple approaches to handle this.

## Resources

- [ChoirGenius API Library](https://github.com/hcamusic/choirgenius)
- [GitHub Actions Documentation](https://docs.github.com/en/actions) 