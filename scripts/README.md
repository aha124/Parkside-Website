# ChoirGenius Integration for Parkside Website

This directory contains scripts for integrating events from your ChoirGenius Groupanizer account with the Parkside website.

## Overview

The integration works by:

1. Fetching events from ChoirGenius using an unofficial API library
2. Converting the events to the format used by the website
3. Updating the JSON file that powers the events display

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

## Troubleshooting

If you encounter issues:

- **Login Failures**: Ensure your username and password are correct
- **No Events Found**: Check that your ChoirGenius account has upcoming events
- **Script Errors**: The unofficial API may break if ChoirGenius changes their website structure. Check for updates to the library.
- **URL Issues**: If the login URL changes, update the `CHOIR_GENIUS_URL` in the script

## Resources

- [ChoirGenius API Library](https://github.com/hcamusic/choirgenius)
- [GitHub Actions Documentation](https://docs.github.com/en/actions) 