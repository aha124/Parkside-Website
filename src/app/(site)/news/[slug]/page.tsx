import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageTransition from "@/components/ui/PageTransition";
import { getMergedNews, type MergedNewsItem } from "@/lib/news-source";
import { matchesNewsParam } from "@/lib/news-links";
import { parseArticleContent } from "@/lib/article-content";

/**
 * A single news article.
 *
 * Reads the same merged list the /news page shows. It previously fetched only
 * the scraped news.json over HTTP, so any article written in the admin — the
 * only kind that links here — could never be found.
 */
async function getNewsItem(param: string): Promise<MergedNewsItem | null> {
  try {
    const news = await getMergedNews();
    return news.find((item) => matchesNewsParam(item, param)) ?? null;
  } catch (error) {
    console.error("Error fetching news item:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const newsItem = await getNewsItem(slug);

  if (!newsItem) {
    return {
      title: "News Article Not Found - Parkside",
      description: "The requested news article could not be found.",
    };
  }

  return {
    title: `${newsItem.title} - Parkside News`,
    description: newsItem.summary,
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const newsItem = await getNewsItem(slug);

  if (!newsItem) {
    notFound();
  }

  const isExternalUrl = (url: string) => /^https?:\/\//i.test(url);

  // Admin articles carry the full story in `content`. Blank lines separate
  // paragraphs and any YouTube link becomes a player where it was written.
  const body = "content" in newsItem ? (newsItem.content ?? "").trim() : "";
  const blocks = parseArticleContent(body);
  const imageUrl = newsItem.imageUrl || "/images/news1.jpg";

  return (
    <PageTransition>
      {/* Article Header */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Link
              href="/news"
              className="text-indigo-400 hover:text-indigo-300 mb-4 inline-block"
            >
              ← Back to All News
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">
              {newsItem.title}
            </h1>
            <p className="text-xl text-white/80 mt-4">{newsItem.date}</p>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-[400px]">
              {isExternalUrl(imageUrl) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={newsItem.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={imageUrl}
                  alt={newsItem.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <div className="p-8">
              <p className="text-lg text-gray-700 mb-6">{newsItem.summary}</p>

              {/* The full story, when there is one. An article with only a
                  summary simply ends here rather than showing filler. */}
              {blocks.map((block, index) =>
                block.type === "video" ? (
                  <div
                    key={index}
                    className="relative w-full mb-6 rounded-lg overflow-hidden bg-black"
                    style={{ aspectRatio: "16 / 9" }}
                  >
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${block.videoId}`}
                      title="YouTube video player"
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <p key={index} className="text-gray-700 mb-6 whitespace-pre-line">
                    {block.segments.map((segment, i) =>
                      segment.type === "link" ? (
                        <a
                          key={i}
                          href={segment.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-500 underline break-words"
                        >
                          {segment.text}
                        </a>
                      ) : (
                        <span key={i}>{segment.text}</span>
                      )
                    )}
                  </p>
                )
              )}

              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link
                  href="/news"
                  className="text-indigo-600 font-medium hover:text-indigo-500"
                >
                  ← Back to All News
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
