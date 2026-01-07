import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getEventOverrides, createEventOverride, updateEventOverride } from "@/lib/admin-data";
import fs from "fs";
import path from "path";

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

async function getScrapedEvents(): Promise<ScrapedEvent[]> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "events.json");
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // First check if there's an override for this event
  const overrides = await getEventOverrides();
  const override = overrides.find((o) => o.originalId === id);

  // Get the original scraped event
  const scrapedEvents = await getScrapedEvents();
  const scrapedEvent = scrapedEvents.find((e) => e.id === id);

  if (!scrapedEvent) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // Return merged data - override values take precedence
  const eventData = {
    ...scrapedEvent,
    ...(override ? {
      title: override.title || scrapedEvent.title,
      date: override.date || scrapedEvent.date,
      startTime: override.startTime || scrapedEvent.startTime,
      endTime: override.endTime || scrapedEvent.endTime,
      description: override.description || scrapedEvent.description,
      location: override.location || scrapedEvent.location,
      imageUrl: override.imageUrl || scrapedEvent.imageUrl,
      chorus: override.chorus || scrapedEvent.chorus,
      url: override.url || scrapedEvent.url,
    } : {}),
    hasOverride: !!override,
    overrideId: override?.id,
  };

  return NextResponse.json({ success: true, data: eventData });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Check if there's already an override for this scraped event
    const overrides = await getEventOverrides();
    const existingOverride = overrides.find((o) => o.originalId === id);

    let result;
    if (existingOverride) {
      // Update existing override
      result = await updateEventOverride(existingOverride.id, {
        ...body,
        originalId: id,
      });
    } else {
      // Create new override
      result = await createEventOverride({
        ...body,
        originalId: id,
      });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating scraped event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}
