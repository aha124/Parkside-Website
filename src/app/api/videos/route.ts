import { NextResponse } from "next/server";
import { getVideos } from "@/lib/admin-data";

// Public API endpoint for fetching videos (no auth required)
export async function GET() {
  try {
    const videos = await getVideos();

    // Sort by year (newest first)
    const sortedVideos = [...videos].sort((a, b) => b.year - a.year);

    return NextResponse.json({ success: true, data: sortedVideos });
  } catch (error) {
    console.error("Error fetching videos:", error);
    // Return empty array if KV is not configured
    return NextResponse.json({ success: true, data: [] });
  }
}
