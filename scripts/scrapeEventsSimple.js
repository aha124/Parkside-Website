/**
 * Simple events scraper using fetch + cheerio (no Puppeteer needed)
 *
 * Usage: node scripts/scrapeEventsSimple.js
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');

const EVENTS_URL = 'https://parksideharmony.org/events';
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'data', 'events.json');

const DEFAULT_IMAGES = {
  'Harmony': '/images/harmony-event.jpg',
  'Melody': '/images/melody-event.jpg',
  'Both': '/images/parkside-event.jpg',
  'default': '/images/event-default.jpg'
};

function determineChorus(text) {
  text = text.toLowerCase();
  if (text.includes('harmony') && !text.includes('melody')) return 'Harmony';
  if (text.includes('melody') && !text.includes('harmony')) return 'Melody';
  if (text.includes('harmony') && text.includes('melody')) return 'Both';
  if (text.includes('parkside')) return 'Both';
  return 'Both';
}

function parseDateTime(dateTimeStr) {
  try {
    // Match pattern like "Jan 19 2026 - 7:00pm to 10:00pm"
    const parts = dateTimeStr.match(/([A-Za-z]+)\s+(\d+)\s+(\d+)\s+-\s+(\d+:\d+[ap]m)\s+to\s+(\d+:\d+[ap]m)/i);
    if (!parts) {
      return { formattedDate: dateTimeStr.trim(), startTime: '', endTime: '' };
    }
    return {
      formattedDate: `${parts[1]} ${parts[2]}, ${parts[3]}`,
      startTime: parts[4],
      endTime: parts[5]
    };
  } catch (error) {
    return { formattedDate: dateTimeStr.trim(), startTime: '', endTime: '' };
  }
}

async function fetchEventDetails(url) {
  try {
    console.log(`  Fetching details: ${url}`);
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract description
    let description = '';
    $('.field-name-body .field-item').each((i, el) => {
      description += $(el).text().trim() + ' ';
    });

    // Extract image URL
    let imageUrl = '';
    const imgElement = $('.field-name-field-image img').first();
    if (imgElement.length > 0) {
      imageUrl = imgElement.attr('src');
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `https://parksideharmony.org${imageUrl}`;
      }
    }

    // Extract location
    let location = '';
    $('.field-name-field-location .field-item').each((i, el) => {
      location += $(el).text().trim().replace(/\s+/g, ' ') + ' ';
    });

    // Clean up location
    location = location
      .replace(/See map:.*$/i, '')
      .replace(/Google Maps/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      description: description.trim() || null,
      imageUrl: imageUrl || null,
      location: location || 'See event details'
    };
  } catch (error) {
    console.error(`  Error fetching ${url}:`, error.message);
    return { description: null, imageUrl: null, location: 'See event details' };
  }
}

async function scrapeEvents() {
  console.log(`Fetching events from ${EVENTS_URL}...`);

  const response = await fetch(EVENTS_URL);
  const html = await response.text();
  const $ = cheerio.load(html);

  const events = [];
  const rows = $('table.views-table tbody tr');

  console.log(`Found ${rows.length} event rows`);

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const dateCell = $(row).find('td.views-field-field-event-date');
    const titleCell = $(row).find('td.views-field-title');

    const dateTimeText = dateCell.text().trim();
    const title = titleCell.find('a').text().trim();
    const url = titleCell.find('a').attr('href');

    if (!title || !url) continue;

    const { formattedDate, startTime, endTime } = parseDateTime(dateTimeText);
    const chorus = determineChorus(title);

    console.log(`[${i + 1}/${rows.length}] ${title} - ${formattedDate}`);

    // Fetch event details
    const fullUrl = url.startsWith('http') ? url : `https://parksideharmony.org${url}`;
    const details = await fetchEventDetails(fullUrl);

    events.push({
      id: uuidv4(),
      title,
      date: formattedDate,
      startTime,
      endTime,
      description: details.description || `${title} (${startTime} - ${endTime})`,
      location: details.location,
      imageUrl: details.imageUrl || DEFAULT_IMAGES[chorus] || DEFAULT_IMAGES.default,
      chorus,
      url: fullUrl
    });

    // Small delay to be nice to the server
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return events;
}

async function main() {
  try {
    const events = await scrapeEvents();

    // Sort by date
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Write to file
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(events, null, 2));
    console.log(`\nSuccessfully wrote ${events.length} events to ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
