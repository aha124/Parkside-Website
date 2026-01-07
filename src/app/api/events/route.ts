import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Event } from '@/components/events/EventsList';
import { getEventOverrides } from '@/lib/admin-data';

// Fetch events and merge with any admin overrides
export async function GET() {
  try {
    // Read scraped events from JSON file
    const filePath = path.join(process.cwd(), 'public', 'data', 'events.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const scrapedEvents: Event[] = JSON.parse(fileContents);

    // Get any admin overrides from KV
    const overrides = await getEventOverrides();

    // Create a map of overrides by originalId for quick lookup
    const overrideMap = new Map(
      overrides
        .filter(o => o.originalId)
        .map(o => [o.originalId, o])
    );

    // Merge overrides with scraped events
    const events = scrapedEvents.map(event => {
      const override = overrideMap.get(event.id);
      if (override) {
        // Override values take precedence
        return {
          ...event,
          title: override.title || event.title,
          date: override.date || event.date,
          startTime: override.startTime || event.startTime,
          endTime: override.endTime || event.endTime,
          description: override.description || event.description,
          location: override.location || event.location,
          imageUrl: override.imageUrl || event.imageUrl,
          chorus: override.chorus || event.chorus,
          url: override.url || event.url,
        };
      }
      return event;
    });

    // Sort events by date
    events.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
} 