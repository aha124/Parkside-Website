import fs from "fs";
import path from "path";
import { getNews } from "@/lib/admin-data";
import type { NewsItem } from "@/types/admin";

/**
 * The merged news list: admin-written articles plus scraped ones.
 *
 * Server-only (reads the filesystem and KV). Shared by /api/news and the
 * article page so the listing and the article it links to can't disagree about
 * what exists — the article page used to read only the scraped file, so
 * anything written in the admin 404'd.
 */

export interface ScrapedNewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  imageUrl: string;
  url: string;
  chorus?: string;
}

export type MergedNewsItem = (NewsItem | ScrapedNewsItem) & { chorus?: string };

function readScrapedNews(): ScrapedNewsItem[] {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "news.json");
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    console.log("No scraped news file found");
    return [];
  }
}

async function readAdminNews(): Promise<NewsItem[]> {
  try {
    return await getNews();
  } catch {
    console.log("Could not fetch admin news from KV");
    return [];
  }
}

export async function getMergedNews(): Promise<MergedNewsItem[]> {
  const scrapedNews = readScrapedNews();
  const adminNews = await readAdminNews();

  // An admin article with the same headline replaces the scraped one.
  const adminNewsTitles = new Set(
    adminNews.map((n) => n.title.toLowerCase().trim())
  );

  const merged: MergedNewsItem[] = [...adminNews];

  for (const scraped of scrapedNews) {
    if (!adminNewsTitles.has(scraped.title.toLowerCase().trim())) {
      merged.push({
        ...scraped,
        chorus: (scraped.chorus as NewsItem["chorus"]) || "voices",
      });
    }
  }

  merged.sort((a, b) => {
    const parseDate = (dateStr: string) =>
      new Date(dateStr.replace(/ - \d+:\d+[ap]m/i, "").trim());
    return parseDate(b.date).getTime() - parseDate(a.date).getTime();
  });

  return merged;
}
