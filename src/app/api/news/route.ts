import { NextResponse } from "next/server";
import { getMergedNews } from "@/lib/news-source";

// Public API endpoint for fetching news — merges scraped JSON with admin KV.
// The merge itself lives in lib/news-source so the article page reads exactly
// the same set of articles this endpoint lists.
export async function GET() {
  try {
    return NextResponse.json(await getMergedNews());
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
