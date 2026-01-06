import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getEventOverrides, createEventOverride } from "@/lib/admin-data";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await getEventOverrides();
  return NextResponse.json({ success: true, data: events });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      imageUrl,
      chorus,
      url,
    } = body;

    if (!title || !date || !description || !chorus) {
      return NextResponse.json(
        { error: "Title, date, description, and chorus are required" },
        { status: 400 }
      );
    }

    const event = await createEventOverride({
      title,
      date,
      startTime: startTime || "",
      endTime: endTime || "",
      description,
      location: location || "",
      imageUrl: imageUrl || "",
      chorus,
      url: url || "",
      createdBy: session.user.email || undefined,
    });

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
