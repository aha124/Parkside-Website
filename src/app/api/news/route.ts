import { NextResponse } from "next/server";
import { getNews } from "@/lib/admin-data";

// Public API endpoint for fetching news (no auth required)
export async function GET() {
  try {
    const news = await getNews();

    // Sort by date (newest first based on updatedAt)
    const sortedNews = [...news].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return NextResponse.json({ success: true, data: sortedNews });
  } catch (error) {
    console.error("Error fetching news:", error);
    // Return empty array if KV is not configured
    return NextResponse.json({ success: true, data: [] });
  }
}
