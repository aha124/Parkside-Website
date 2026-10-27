import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Event } from '@/components/events/EventsList';
import { getEventOverrides } from '@/lib/admin-data';
import { eventSortKey } from '@/lib/event-dates';

const DEFAULT_EVENT_IMAGE = '/images/hero-bg.jpg';

// Public events = scraped events (public/data/events.json) + admin data from KV.
//
// The admin stores two kinds of entries under the same KV key:
//   - Overrides of a scraped event: have `originalId`. They either replace
//     fields on that event or, with `isHidden`, remove it from the site.
//   - Events created in the admin: no `originalId`. These must be added to
//     the list on their own. They used to be dropped here entirely, so events
//     added through "Add Event" never appeared on the public site.
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'events.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const scrapedEvents: Event[] = JSON.parse(fileContents);

    const overrides = await getEventOverrides();

    const overrideMap = new Map(
      overrides
        .filter(o => o.originalId)
        .map(o => [o.originalId, o])
    );

    // Scraped events, with admin edits applied and hidden ones removed
    const merged: Event[] = [];
    for (const event of scrapedEvents) {
      const override = overrideMap.get(event.id);
      if (!override) {
        merged.push(event);
        continue;
      }
      if (override.isHidden) continue;
      merged.push({
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
      });
    }

    // Events created in the admin
    for (const item of overrides) {
      if (item.originalId || item.isHidden || !item.title || !item.date) continue;
      merged.push({
        id: item.id,
        title: item.title,
        date: item.date,
        startTime: item.startTime || undefined,
        endTime: item.endTime || undefined,
        description: item.description,
        location: item.location || undefined,
        imageUrl: item.imageUrl || DEFAULT_EVENT_IMAGE,
        chorus: item.chorus,
        url: item.url || undefined,
      });
    }

    merged.sort((a, b) => eventSortKey(a.date) - eventSortKey(b.date));

    return NextResponse.json(merged);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
