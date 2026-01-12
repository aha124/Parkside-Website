import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getVideos, createVideo } from "@/lib/admin-data";

const VALID_CHORUS = ["harmony", "melody", "voices"] as const;
const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;
const MAX_LENGTHS = {
  title: 200,
  description: 2000,
  competition: 200,
  placement: 100,
};

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const videos = await getVideos();
  return NextResponse.json({ success: true, data: videos });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      youtubeId,
      title,
      description,
      year,
      chorus,
      competition,
      placement,
      thumbnailUrl,
    } = body;

    // Validate required fields exist and are strings
    if (!youtubeId || !title || !description || year === undefined || !chorus) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate types
    if (
      typeof youtubeId !== "string" ||
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof chorus !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid field types" },
        { status: 400 }
      );
    }

    // Validate YouTube ID format
    if (!YOUTUBE_ID_REGEX.test(youtubeId)) {
      return NextResponse.json(
        { error: "Invalid YouTube video ID format" },
        { status: 400 }
      );
    }

    // Validate chorus value
    if (!VALID_CHORUS.includes(chorus as typeof VALID_CHORUS[number])) {
      return NextResponse.json(
        { error: "Invalid chorus value" },
        { status: 400 }
      );
    }

    // Validate year is a reasonable number
    const yearNum = typeof year === "number" ? year : parseInt(year, 10);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
      return NextResponse.json(
        { error: "Invalid year" },
        { status: 400 }
      );
    }

    // Validate lengths
    if (
      title.length > MAX_LENGTHS.title ||
      description.length > MAX_LENGTHS.description ||
      (competition && String(competition).length > MAX_LENGTHS.competition) ||
      (placement && String(placement).length > MAX_LENGTHS.placement)
    ) {
      return NextResponse.json(
        { error: "One or more fields exceed maximum length" },
        { status: 400 }
      );
    }

    const video = await createVideo({
      youtubeId,
      title: title.trim(),
      description: description.trim(),
      year: yearNum,
      chorus: chorus as typeof VALID_CHORUS[number],
      competition: competition ? String(competition).trim() : undefined,
      placement: placement ? String(placement).trim() : undefined,
      thumbnailUrl: thumbnailUrl ? String(thumbnailUrl) : undefined,
      createdBy: session.user.email || undefined,
    });

    return NextResponse.json({ success: true, data: video });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
