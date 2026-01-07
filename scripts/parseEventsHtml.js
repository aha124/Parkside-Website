/**
 * Parse events from a local HTML file (use with curl)
 *
 * Usage:
 * 1. curl -s "https://parksideharmony.org/events" > /tmp/events_page.html
 * 2. node scripts/parseEventsHtml.js /tmp/events_page.html
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');

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
      // Try simpler pattern "Jan 19 2026"
      const simpleParts = dateTimeStr.match(/([A-Za-z]+)\s+(\d+)\s+(\d+)/);
      if (simpleParts) {
        return { formattedDate: `${simpleParts[1]} ${simpleParts[2]}, ${simpleParts[3]}`, startTime: '', endTime: '' };
      }
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

function parseEventsFromHtml(html) {
  const $ = cheerio.load(html);
  const events = [];
  const rows = $('table.views-table tbody tr');

  console.log(`Found ${rows.length} event rows`);

  rows.each((i, row) => {
    const dateCell = $(row).find('td.views-field-field-event-date');
    const titleCell = $(row).find('td.views-field-title');

    const dateTimeText = dateCell.text().trim();
    const title = titleCell.find('a').text().trim();
    let url = titleCell.find('a').attr('href');

    if (!title || !url) return;

    // Ensure full URL
    if (!url.startsWith('http')) {
      url = `https://parksideharmony.org${url}`;
    }

    const { formattedDate, startTime, endTime } = parseDateTime(dateTimeText);
    const chorus = determineChorus(title);

    console.log(`[${events.length + 1}] ${title} - ${formattedDate}`);

    events.push({
      id: uuidv4(),
      title,
      date: formattedDate,
      startTime,
      endTime,
      description: startTime && endTime
        ? `${title} from ${startTime} to ${endTime}. Contact parksideharmony@parksideharmony.org for more information.`
        : `${title}. Contact parksideharmony@parksideharmony.org for more information.`,
      location: 'Christ Presbyterian Church, 421 Deerfield Road, Camp Hill, PA 17011',
      imageUrl: DEFAULT_IMAGES[chorus] || DEFAULT_IMAGES.default,
      chorus,
      url
    });
  });

  return events;
}

function main() {
  const inputFile = process.argv[2] || '/tmp/events_page.html';

  if (!fs.existsSync(inputFile)) {
    console.error(`File not found: ${inputFile}`);
    console.error('\nUsage:');
    console.error('  curl -s "https://parksideharmony.org/events" > /tmp/events_page.html');
    console.error('  node scripts/parseEventsHtml.js /tmp/events_page.html');
    process.exit(1);
  }

  console.log(`Reading HTML from ${inputFile}...`);
  const html = fs.readFileSync(inputFile, 'utf-8');

  const events = parseEventsFromHtml(html);

  // Sort by date
  events.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Write to file
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(events, null, 2));
  console.log(`\nSuccessfully wrote ${events.length} events to ${OUTPUT_FILE}`);
}

main();
