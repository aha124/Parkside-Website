import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchYouTubeMetadata } from "@/lib/admin-data";

// Pattern to validate YouTube URLs/IDs
const YOUTUBE_URL_PATTERN = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+|^[a-zA-Z0-9_-]{11}$/;
const MAX_URL_LENGTH = 2000;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL length
    if (url.length > MAX_URL_LENGTH) {
      return NextResponse.json({ error: "URL too long" }, { status: 400 });
    }

    // Basic validation that it looks like a YouTube URL or video ID
    if (!YOUTUBE_URL_PATTERN.test(url)) {
      return NextResponse.json(
        { error: "Invalid YouTube URL or video ID format" },
        { status: 400 }
      );
    }

    const metadata = await fetchYouTubeMetadata(url);

    if (!metadata) {
      return NextResponse.json(
        { error: "Could not fetch video metadata. Please check the URL." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: metadata });
  } catch (error) {
    console.error("Error fetching YouTube metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch video metadata" },
      { status: 500 }
    );
  }
}
