/**
 * Sync events from parksideharmony.org
 * This script is used by GitHub Actions to automatically update events
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const EVENTS_URL = 'https://parksideharmony.org/events';

const DEFAULT_IMAGES = {
  'Harmony': '/images/harmony-performance.jpg',
  'Melody': '/images/melody-performance.jpg',
  'Both': '/images/hero-bg.jpg',
  'default': '/images/hero-bg.jpg'
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
    const parts = dateTimeStr.match(/([A-Za-z]+)\s+(\d+)\s+(\d+)\s+-\s+(\d+:\d+[ap]m)\s+to\s+(\d+:\d+[ap]m)/i);
    if (!parts) {
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
  } catch {
    return { formattedDate: dateTimeStr.trim(), startTime: '', endTime: '' };
  }
}

function generateEventId(title, date) {
  const normalized = `${title.toLowerCase().replace(/\s+/g, '-')}-${date.replace(/[^a-zA-Z0-9]/g, '')}`;
  return normalized;
}

async function fetchEventsPage() {
  const response = await fetch(EVENTS_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; ParksideWebsiteBot/1.0)'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch events page: ${response.status}`);
  }
  return response.text();
}

function parseEventsFromHtml(html) {
  const $ = cheerio.load(html);
  const events = [];
  const rows = $('table.views-table tbody tr');

  rows.each((_, row) => {
    const dateCell = $(row).find('td.views-field-field-event-date');
    const titleCell = $(row).find('td.views-field-title');

    const dateTimeText = dateCell.text().trim();
    const title = titleCell.find('a').text().trim();
    let url = titleCell.find('a').attr('href');

    if (!title || !url) return;

    if (!url.startsWith('http')) {
      url = `https://parksideharmony.org${url}`;
    }

    const { formattedDate, startTime, endTime } = parseDateTime(dateTimeText);
    const chorus = determineChorus(title);
    const eventId = generateEventId(title, formattedDate);

    events.push({
      id: eventId,
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

function parseEventDate(dateStr) {
  const cleanDate = dateStr.split('-')[0].trim().replace(/,\s*$/, '');
  const parsed = new Date(cleanDate.replace(/(\w{3,})\s+(\d+),?\s+(\d{4})/, "$1 $2 $3"));
  return isNaN(parsed.getTime()) ? new Date(dateStr) : parsed;
}

function filterOldEvents(events, maxAgeDays = 180) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - maxAgeDays);
  cutoffDate.setHours(0, 0, 0, 0);

  const filtered = events.filter(event => {
    const eventDate = parseEventDate(event.date);
    return eventDate >= cutoffDate;
  });

  return {
    filtered,
    removedCount: events.length - filtered.length
  };
}

async function main() {
  try {
    console.log('Fetching events from', EVENTS_URL);
    const html = await fetchEventsPage();
    
    console.log('Parsing events...');
    const events = parseEventsFromHtml(html);
    console.log(`Found ${events.length} events on source`);

    console.log('Filtering old events (180+ days)...');
    const { filtered: cleanedEvents, removedCount } = filterOldEvents(events, 180);
    if (removedCount > 0) {
      console.log(`Removed ${removedCount} old events`);
    }

    // Sort by date
    cleanedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Save to file
    const filePath = path.join(process.cwd(), 'public', 'data', 'events.json');
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(cleanedEvents, null, 2));

    console.log(`✓ Successfully synced ${cleanedEvents.length} events to ${filePath}`);
    process.exit(0);
  } catch (error) {
    console.error('Error syncing events:', error);
    process.exit(1);
  }
}

main();
