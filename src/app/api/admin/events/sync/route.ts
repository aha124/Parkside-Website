import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";

const EVENTS_URL = 'https://parksideharmony.org/events';

const DEFAULT_IMAGES: Record<string, string> = {
  'Harmony': '/images/harmony-performance.jpg',
  'Melody': '/images/melody-performance.jpg',
  'Both': '/images/hero-bg.jpg',
  'default': '/images/hero-bg.jpg'
};

interface ScrapedEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  imageUrl: string;
  chorus: string;
  url: string;
}

function determineChorus(text: string): string {
  text = text.toLowerCase();
  if (text.includes('harmony') && !text.includes('melody')) return 'Harmony';
  if (text.includes('melody') && !text.includes('harmony')) return 'Melody';
  if (text.includes('harmony') && text.includes('melody')) return 'Both';
  if (text.includes('parkside')) return 'Both';
  return 'Both';
}

function parseDateTime(dateTimeStr: string): { formattedDate: string; startTime: string; endTime: string } {
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

function generateEventId(title: string, date: string): string {
  // Create a deterministic ID based on title and date for delta checking
  const normalized = `${title.toLowerCase().replace(/\s+/g, '-')}-${date.replace(/[^a-zA-Z0-9]/g, '')}`;
  return normalized;
}

async function fetchEventsPage(): Promise<string> {
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

function parseEventsFromHtml(html: string): ScrapedEvent[] {
  const $ = cheerio.load(html);
  const events: ScrapedEvent[] = [];
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

function getExistingEvents(): ScrapedEvent[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'events.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveEvents(events: ScrapedEvent[]): void {
  const filePath = path.join(process.cwd(), 'public', 'data', 'events.json');
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(events, null, 2));
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch and parse new events
    const html = await fetchEventsPage();
    const newScrapedEvents = parseEventsFromHtml(html);

    // Get existing events
    const existingEvents = getExistingEvents();

    // Create a map of existing events by a normalized key (title + date)
    const existingEventKeys = new Set(
      existingEvents.map(e => generateEventId(e.title, e.date))
    );

    // Find events that are truly new (not in existing list)
    const eventsToAdd = newScrapedEvents.filter(
      e => !existingEventKeys.has(generateEventId(e.title, e.date))
    );

    // Merge: keep existing events and add new ones
    const mergedEvents = [...existingEvents, ...eventsToAdd];

    // Sort by date
    mergedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Save
    saveEvents(mergedEvents);

    return NextResponse.json({
      success: true,
      message: `Sync complete. Found ${newScrapedEvents.length} events on source. Added ${eventsToAdd.length} new events.`,
      stats: {
        sourceCount: newScrapedEvents.length,
        existingCount: existingEvents.length,
        addedCount: eventsToAdd.length,
        totalCount: mergedEvents.length
      }
    });

  } catch (error) {
    console.error("Error syncing events:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sync events" },
      { status: 500 }
    );
  }
}
