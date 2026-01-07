import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getNews } from "@/lib/admin-data";
import type { NewsItem } from "@/types/admin";

interface ScrapedNewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  imageUrl: string;
  url: string;
  chorus?: string;
}

// Public API endpoint for fetching news - merges scraped JSON with admin KV
export async function GET() {
  try {
    // Read scraped news from JSON file
    let scrapedNews: ScrapedNewsItem[] = [];
    try {
      const filePath = path.join(process.cwd(), "public", "data", "news.json");
      const fileContents = fs.readFileSync(filePath, "utf8");
      scrapedNews = JSON.parse(fileContents);
    } catch {
      console.log("No scraped news file found");
    }

    // Get admin-created/edited news from KV
    let adminNews: NewsItem[] = [];
    try {
      adminNews = await getNews();
    } catch {
      console.log("Could not fetch admin news from KV");
    }

    // Create a set of admin news titles (normalized) to avoid duplicates
    const adminNewsTitles = new Set(
      adminNews.map(n => n.title.toLowerCase().trim())
    );

    // Merge: admin news first, then scraped news that aren't duplicates
    const mergedNews: (NewsItem | ScrapedNewsItem)[] = [...adminNews];

    for (const scraped of scrapedNews) {
      const normalizedTitle = scraped.title.toLowerCase().trim();
      // Only add scraped news if there's no admin version with same title
      if (!adminNewsTitles.has(normalizedTitle)) {
        mergedNews.push({
          ...scraped,
          chorus: (scraped.chorus as NewsItem["chorus"]) || "voices",
        });
      }
    }

    // Sort by date (newest first)
    mergedNews.sort((a, b) => {
      // Try to parse dates - handle various formats
      const parseDate = (dateStr: string) => {
        // Remove "more" and other suffixes
        const clean = dateStr.replace(/ - \d+:\d+[ap]m/i, "").trim();
        return new Date(clean);
      };
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    return NextResponse.json(mergedNews);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
