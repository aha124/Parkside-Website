import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getNews, createNews } from "@/lib/admin-data";
import fs from "fs";
import path from "path";
import type { ChorusTag } from "@/types/admin";

interface ScrapedNewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  imageUrl: string;
  url: string;
  chorus?: string;
}

function getScrapedNews(): ScrapedNewsItem[] {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "news.json");
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get scraped news from JSON file
    const scrapedNews = getScrapedNews();

    // Get existing admin news from KV
    const existingNews = await getNews();

    // Create a set of existing news titles (normalized) for duplicate checking
    const existingTitles = new Set(
      existingNews.map(n => n.title.toLowerCase().trim())
    );

    // Find news that are not yet in admin
    const newsToAdd = scrapedNews.filter(
      n => !existingTitles.has(n.title.toLowerCase().trim())
    );

    // Import new news to admin KV
    let addedCount = 0;
    for (const news of newsToAdd) {
      await createNews({
        title: news.title,
        date: news.date.replace(/ - \d+:\d+[ap]m/i, "").trim(), // Clean up date format
        summary: news.summary.replace(/ more$/, "").trim(), // Remove "more" suffix
        imageUrl: news.imageUrl,
        url: news.url.startsWith("/node/")
          ? `https://parksideharmony.org${news.url}`
          : news.url,
        chorus: (news.chorus?.toLowerCase() as ChorusTag) || "voices",
      });
      addedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Sync complete. Found ${scrapedNews.length} news articles. Added ${addedCount} new articles to admin.`,
      stats: {
        sourceCount: scrapedNews.length,
        existingCount: existingNews.length,
        addedCount,
        totalCount: existingNews.length + addedCount,
      },
    });
  } catch (error) {
    console.error("Error syncing news:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sync news" },
      { status: 500 }
    );
  }
}
