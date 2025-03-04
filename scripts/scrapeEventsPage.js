/**
 * Script to scrape events directly from the Parkside Harmony events page
 * 
 * This script uses Puppeteer to scrape the events page and extract event information,
 * then saves it to the events.json file.
 * 
 * Usage:
 * 1. Install dependencies: npm install puppeteer cheerio uuid
 * 2. Run this script: node scripts/scrapeEventsPage.js
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');

// Configuration
const EVENTS_URL = 'https://parksideharmony.org/events';
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'data', 'events.json');

// Default image paths for different chorus types
const DEFAULT_IMAGES = {
  'Harmony': '/images/harmony-event.jpg',
  'Melody': '/images/melody-event.jpg',
  'Both': '/images/parkside-event.jpg',
  'default': '/images/event-default.jpg'
};

/**
 * Determine which chorus an event belongs to based on its title or description
 * @param {string} text - The event title or description
 * @returns {string} 'Harmony', 'Melody', or 'Both'
 */
function determineChorus(text) {
  text = text.toLowerCase();
  
  if (text.includes('harmony') && !text.includes('melody')) {
    return 'Harmony';
  } else if (text.includes('melody') && !text.includes('harmony')) {
    return 'Melody';
  } else if (text.includes('harmony') && text.includes('melody')) {
    return 'Both';
  } else if (text.includes('parkside')) {
    // If it just mentions Parkside without specifying which chorus
    return 'Both';
  }
  
  return 'Both'; // Default to both if unclear
}

/**
 * Parse date and time strings into a formatted date string
 * @param {string} dateTimeStr - The date and time string (e.g., "Mar 9 2025 - 5:00pm to 9:00pm")
 * @returns {Object} Object with formatted date string and start/end times
 */
function parseDateTime(dateTimeStr) {
  try {
    // Extract date and time parts
    const parts = dateTimeStr.match(/([A-Za-z]+)\s+(\d+)\s+(\d+)\s+-\s+(\d+:\d+[ap]m)\s+to\s+(\d+:\d+[ap]m)/i);
    
    if (!parts) {
      return { 
        formattedDate: dateTimeStr,
        startTime: '',
        endTime: ''
      };
    }
    
    const month = parts[1];
    const day = parts[2];
    const year = parts[3];
    const startTime = parts[4];
    const endTime = parts[5];
    
    return {
      formattedDate: `${month} ${day}, ${year}`,
      startTime,
      endTime
    };
  } catch (error) {
    console.error('Error parsing date time:', error);
    return { 
      formattedDate: dateTimeStr,
      startTime: '',
      endTime: ''
    };
  }
}

/**
 * Fetch detailed information from an event's detail page
 * @param {Object} browser - Puppeteer browser instance
 * @param {string} url - URL of the event detail page
 * @returns {Promise<Object>} Object with detailed event information
 */
async function fetchEventDetails(browser, url) {
  console.log(`Fetching details from ${url}...`);
  
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Get the page content
    const content = await page.content();
    const $ = cheerio.load(content);
    
    // Extract the full description
    let fullDescription = '';
    $('.field-name-body .field-item').each((i, el) => {
      fullDescription += $(el).text().trim() + ' ';
    });
    
    // Extract the image URL
    let imageUrl = '';
    const imgElement = $('.field-name-field-image img').first();
    if (imgElement.length > 0) {
      imageUrl = imgElement.attr('src');
      
      // Convert relative URLs to absolute
      if (imageUrl && !imageUrl.startsWith('http')) {
        const baseUrl = new URL(url).origin;
        imageUrl = `${baseUrl}${imageUrl}`;
      }
    }
    
    // Extract location if available
    let location = 'See event details';
    $('.field-name-field-location').each((i, el) => {
      const locationText = $(el).text().trim();
      if (locationText) {
        location = locationText;
      }
    });
    
    await page.close();
    
    return {
      fullDescription: fullDescription || null,
      imageUrl: imageUrl || null,
      location: location || 'See event details'
    };
  } catch (error) {
    console.error(`Error fetching details from ${url}:`, error);
    return {
      fullDescription: null,
      imageUrl: null,
      location: 'See event details'
    };
  }
}

/**
 * Scrape events from the Parkside Harmony events page
 * @returns {Promise<Array>} Array of event objects
 */
async function scrapeEvents() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    console.log(`Navigating to ${EVENTS_URL}...`);
    const page = await browser.newPage();
    await page.goto(EVENTS_URL, { waitUntil: 'networkidle2' });
    
    // Get the page content
    const content = await page.content();
    const $ = cheerio.load(content);
    
    console.log('Extracting events...');
    const events = [];
    
    // Extract events from the table
    const eventRows = $('table tr');
    console.log(`Found ${eventRows.length} event rows`);
    
    // Process each event row
    for (let i = 0; i < eventRows.length; i++) {
      const row = eventRows[i];
      const dateTime = $(row).find('td:first-child').text().trim();
      const eventCell = $(row).find('td:last-child');
      const title = eventCell.find('a').text().trim();
      const url = eventCell.find('a').attr('href');
      
      if (dateTime && title && url) {
        const { formattedDate, startTime, endTime } = parseDateTime(dateTime);
        const chorus = determineChorus(title);
        
        // Create basic event object
        const event = {
          id: uuidv4(),
          title,
          date: formattedDate,
          startTime,
          endTime,
          description: `${title} (${startTime} - ${endTime})`,
          location: 'See event details',
          imageUrl: DEFAULT_IMAGES[chorus],
          chorus,
          url
        };
        
        // Fetch detailed information if URL is available
        if (url && url !== '#') {
          console.log(`Processing event ${i+1}/${eventRows.length}: ${title}`);
          
          // Make sure URL is absolute
          const fullUrl = url.startsWith('http') ? url : `https://parksideharmony.org${url}`;
          
          // Fetch detailed information
          const details = await fetchEventDetails(browser, fullUrl);
          
          // Update event with detailed information
          if (details.fullDescription) {
            event.description = details.fullDescription;
          }
          
          if (details.imageUrl) {
            event.imageUrl = details.imageUrl;
          }
          
          if (details.location) {
            event.location = details.location;
          }
        }
        
        events.push(event);
      }
    }
    
    // Also check for featured events which might have more details
    const featuredEvents = $('.view-events.view-display-id-block_vert .views-row');
    console.log(`Found ${featuredEvents.length} featured events`);
    
    for (let i = 0; i < featuredEvents.length; i++) {
      const featuredSection = featuredEvents[i];
      
      const dateTime = $(featuredSection).find('.views-field-field-event-date').text().trim();
      const title = $(featuredSection).find('.views-field-title a').text().trim();
      const description = $(featuredSection).find('.views-field-body').text().trim();
      const url = $(featuredSection).find('.views-field-title a').attr('href');
      
      // Try to get the image directly from the featured section
      let imageUrl = null;
      const imgElement = $(featuredSection).find('.views-field-field-image img');
      if (imgElement.length > 0) {
        imageUrl = imgElement.attr('src');
        
        // Convert relative URLs to absolute
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `https://parksideharmony.org${imageUrl}`;
        }
      }
      
      if (dateTime && title) {
        const { formattedDate, startTime, endTime } = parseDateTime(dateTime);
        const chorus = determineChorus(title + ' ' + description);
        
        // Check if this event is already in our list
        const existingIndex = events.findIndex(e => e.title === title);
        
        if (existingIndex >= 0) {
          // Update the existing event with more details
          if (description) {
            events[existingIndex].description = description;
          }
          
          if (imageUrl) {
            events[existingIndex].imageUrl = imageUrl;
          }
        } else if (url) {
          // Create a new event object
          const event = {
            id: uuidv4(),
            title,
            date: formattedDate,
            startTime,
            endTime,
            description: description || `${title} (${startTime} - ${endTime})`,
            location: 'See event details',
            imageUrl: imageUrl || DEFAULT_IMAGES[chorus],
            chorus,
            url
          };
          
          // Fetch detailed information if URL is available
          if (url && url !== '#') {
            // Make sure URL is absolute
            const fullUrl = url.startsWith('http') ? url : `https://parksideharmony.org${url}`;
            
            // Fetch detailed information
            const details = await fetchEventDetails(browser, fullUrl);
            
            // Update event with detailed information
            if (details.fullDescription) {
              event.description = details.fullDescription;
            }
            
            if (details.imageUrl && !imageUrl) {
              event.imageUrl = details.imageUrl;
            }
            
            if (details.location) {
              event.location = details.location;
            }
          }
          
          events.push(event);
        }
      }
    }
    
    console.log(`Found ${events.length} events total`);
    return events;
    
  } catch (error) {
    console.error('Error scraping events:', error);
    return [];
  } finally {
    await browser.close();
  }
}

/**
 * Create dummy events for testing or when no events are found
 * @returns {Array} Array of dummy event objects
 */
function createDummyEvents() {
  return [
    {
      id: uuidv4(),
      title: "Parkside Harmony Rehearsal",
      date: "March 10, 2025",
      startTime: "7:00pm",
      endTime: "10:00pm",
      description: "Regular rehearsal for Parkside Harmony chorus. Join us for an evening of music and fellowship as we prepare for upcoming performances.",
      location: "Hershey, PA",
      imageUrl: DEFAULT_IMAGES['Harmony'],
      chorus: "Harmony",
      url: "#"
    },
    {
      id: uuidv4(),
      title: "Parkside Melody Rehearsal",
      date: "March 9, 2025",
      startTime: "5:00pm",
      endTime: "9:00pm",
      description: "Regular rehearsal for Parkside Melody chorus. All treble voices are welcome to join us for this exciting rehearsal as we work on our repertoire.",
      location: "Hershey, PA",
      imageUrl: DEFAULT_IMAGES['Melody'],
      chorus: "Melody",
      url: "#"
    },
    {
      id: uuidv4(),
      title: "10th Anniversary Chapter Show",
      date: "June 21, 2025",
      startTime: "3:00pm",
      endTime: "5:30pm",
      description: "Join us for our 10th Anniversary celebration featuring both Parkside Harmony and Parkside Melody choruses. This special event will showcase our award-winning performances and guest quartets.",
      location: "Hershey Theatre",
      imageUrl: DEFAULT_IMAGES['Both'],
      chorus: "Both",
      url: "#"
    }
  ];
}

/**
 * Main function to scrape events and update the JSON file
 */
async function main() {
  try {
    // Create the output directory if it doesn't exist
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Scrape events from the website
    const events = await scrapeEvents();
    
    // If no events were found, use dummy events
    const finalEvents = events.length > 0 ? events : createDummyEvents();
    
    // Sort events by date
    finalEvents.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
    
    // Write to JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalEvents, null, 2));
    console.log(`Successfully wrote ${finalEvents.length} events to ${OUTPUT_FILE}`);
    
  } catch (error) {
    console.error('Error in main function:', error);
    
    // Even if there's an error, create dummy events
    console.log('Creating dummy events due to error...');
    const dummyEvents = createDummyEvents();
    
    // Write to JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(dummyEvents, null, 2));
    console.log(`Successfully wrote ${dummyEvents.length} dummy events to ${OUTPUT_FILE}`);
  }
}

// Run the main function
main(); 