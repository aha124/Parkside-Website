import type { Event } from "@/components/events/EventsList";
import type { EventItem } from "@/types/admin";

/**
 * Merge admin overrides (stored in KV) onto scraped events (from the JSON file),
 * then sort by date ascending.
 *
 * Overrides are matched to scraped events by `originalId === event.id`. For a
 * matched event, each override field takes precedence only when truthy, so a
 * blank override field falls back to the scraped value. Pure and
 * side-effect-free so it can be unit-tested in isolation.
 */
export function mergeEventOverrides(
  scrapedEvents: Event[],
  overrides: EventItem[]
): Event[] {
  const overrideMap = new Map(
    overrides.filter((o) => o.originalId).map((o) => [o.originalId, o])
  );

  const events = scrapedEvents.map((event) => {
    const override = overrideMap.get(event.id);
    if (!override) return event;
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
  });

  return events.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}
