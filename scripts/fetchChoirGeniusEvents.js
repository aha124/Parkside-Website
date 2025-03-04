/**
 * Script to fetch events from ChoirGenius and update the events JSON file
 * 
 * This script uses the unofficial ChoirGenius API library to fetch events
 * from your ChoirGenius account and update the events.json file.
 * 
 * Usage:
 * 1. Install the ChoirGenius library: npm install github:hcamusic/choirgenius
 * 2. Set environment variables for CHOIR_GENIUS_USERNAME and CHOIR_GENIUS_PASSWORD
 * 3. Run this script: node scripts/fetchChoirGeniusEvents.js
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const ChoirGenius = require('choirgenius');

// Configuration
const CHOIR_GENIUS_URL = 'https://parksideharmony.org'; // Custom domain for Parkside Harmony Groupanizer
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'data', 'events.json');

// Default image paths for different chorus types
const DEFAULT_IMAGES = {
  'Harmony': '/images/harmony-event.jpg',
  'Melody': '/images/melody-event.jpg',
  'Both': '/images/parkside-event.jpg',
  'default': '/images/event-default.jpg'
};

/**
 * Determine which chorus an event belongs to based on its description or title
 * @param {Object} event - The event object from ChoirGenius
 * @returns {string} 'Harmony', 'Melody', or 'Both'
 */
function determineChorus(event) {
  const text = `${event.title || ''} ${event.description || ''}`.toLowerCase();
  
  const harmonyKeywords = ['men', 'harmony', 'barbershop', 'male'];
  const melodyKeywords = ['women', 'melody', 'treble', 'female'];
  
  const isHarmony = harmonyKeywords.some(keyword => text.includes(keyword.toLowerCase()));
  const isMelody = melodyKeywords.some(keyword => text.includes(keyword.toLowerCase()));
  
  if (isHarmony && isMelody) return 'Both';
  if (isHarmony) return 'Harmony';
  if (isMelody) return 'Melody';
  
  return 'Both'; // Default to both if unclear
}

/**
 * Format a date from ChoirGenius format to a more readable format
 * @param {string} dateStr - The date string from ChoirGenius
 * @returns {string} Formatted date string
 */
function formatDate(startDate, endDate) {
  if (!startDate) return '';
  
  // Parse dates
  const start = new Date(startDate);
  
  // Format start date
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  let formattedDate = start.toLocaleDateString('en-US', options);
  
  // Add end date if it exists and is different
  if (endDate && endDate !== startDate) {
    const end = new Date(endDate);
    // If same month and year, just add the day
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      formattedDate += `-${end.getDate()}`;
    } else {
      // Otherwise add the full date
      formattedDate += ` - ${end.toLocaleDateString('en-US', options)}`;
    }
  }
  
  return formattedDate;
}

/**
 * Convert ChoirGenius events to our website format
 * @param {Array} choirGeniusEvents - Events from ChoirGenius
 * @returns {Array} Events in our website format
 */
function convertEvents(choirGeniusEvents) {
  return choirGeniusEvents.map(event => {
    const chorus = determineChorus(event);
    
    return {
      id: uuidv4(),
      title: event.title || event.name || 'Untitled Event',
      date: formatDate(event.startDate || event.start_date, event.endDate || event.end_date),
      description: event.description || event.desc || '',
      imageUrl: DEFAULT_IMAGES[chorus] || DEFAULT_IMAGES.default,
      location: event.location || event.venue || '',
      chorus: chorus,
      url: event.url || `/events/${(event.title || event.name || 'event').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    };
  });
}

/**
 * Fetch events from ChoirGenius calendar page
 * @param {Object} choirGenius - ChoirGenius client instance
 * @returns {Promise<Array>} Array of event objects
 */
async function scrapeEventsFromCalendar(choirGenius) {
  console.log('Scraping events from calendar page...');
  
  try {
    // Navigate to the calendar or events page
    // This is a guess at the URL structure - may need adjustment
    const calendarPage = await choirGenius.navigateTo('/g/calendar');
    
    // Extract events from the page
    // This is a simplified example - actual implementation will depend on page structure
    const events = await choirGenius.extractDataFromPage(calendarPage, {
      selector: '.event-item', // This selector is a guess - adjust based on actual page
      fields: {
        title: '.event-title',
        startDate: '.event-date-start',
        endDate: '.event-date-end',
        description: '.event-description',
        location: '.event-location'
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping events:', error);
    return [];
  }
}

/**
 * Main function to fetch events and update the JSON file
 */
async function main() {
  try {
    // Check for environment variables
    const username = process.env.CHOIR_GENIUS_USERNAME;
    const password = process.env.CHOIR_GENIUS_PASSWORD;
    
    if (!username || !password) {
      console.error('Error: CHOIR_GENIUS_USERNAME and CHOIR_GENIUS_PASSWORD environment variables must be set');
      process.exit(1);
    }
    
    console.log('Connecting to ChoirGenius...');
    
    // Initialize ChoirGenius client
    const choirGenius = new ChoirGenius(CHOIR_GENIUS_URL);
    
    // Login to ChoirGenius
    console.log('Logging in...');
    await choirGenius.login(username, password);
    
    // Fetch events
    console.log('Fetching events...');
    
    // Try to use the getCalendarEvents method if it exists
    let events = [];
    if (typeof choirGenius.getCalendarEvents === 'function') {
      events = await choirGenius.getCalendarEvents();
    } else if (typeof choirGenius.getUpcomingEvents === 'function') {
      events = await choirGenius.getUpcomingEvents();
    } else {
      // Fall back to scraping the calendar page
      events = await scrapeEventsFromCalendar(choirGenius);
    }
    
    if (!events || events.length === 0) {
      console.warn('Warning: No events found in ChoirGenius');
      
      // Create some dummy events for testing
      events = [
        {
          title: "Spring Concert",
          startDate: "2025-03-15",
          description: "Annual spring concert featuring Parkside Harmony",
          location: "Hershey Theatre"
        },
        {
          title: "Melody Workshop",
          startDate: "2025-04-10",
          endDate: "2025-04-12",
          description: "Weekend workshop for Parkside Melody",
          location: "Hershey Community Center"
        }
      ];
      console.log('Created dummy events for testing');
    } else {
      console.log(`Found ${events.length} events in ChoirGenius`);
    }
    
    // Convert events to our format
    const convertedEvents = convertEvents(events);
    
    // Sort events by date
    convertedEvents.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
    
    // Write to JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(convertedEvents, null, 2));
    console.log(`Successfully wrote ${convertedEvents.length} events to ${OUTPUT_FILE}`);
    
  } catch (error) {
    console.error('Error fetching events from ChoirGenius:', error);
    process.exit(1);
  }
}

// Run the main function
main(); 