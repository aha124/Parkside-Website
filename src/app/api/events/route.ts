import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Event } from '@/components/events/EventsList';
import { getEventOverrides } from '@/lib/admin-data';
import { mergeEventOverrides } from '@/lib/events';

// Fetch events and merge with any admin overrides
export async function GET() {
  try {
    // Read scraped events from JSON file
    const filePath = path.join(process.cwd(), 'public', 'data', 'events.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const scrapedEvents: Event[] = JSON.parse(fileContents);

    // Get any admin overrides from KV and merge them onto the scraped events
    const overrides = await getEventOverrides();
    const events = mergeEventOverrides(scrapedEvents, overrides);

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
} 