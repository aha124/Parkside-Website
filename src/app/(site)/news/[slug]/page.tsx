import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageTransition from "@/components/ui/PageTransition";
import { getMergedNews, type MergedNewsItem } from "@/lib/news-source";
import { matchesNewsParam } from "@/lib/news-links";

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

  // Admin articles carry the full story in `content`; blank lines separate
  // paragraphs, matching how the admin textarea is written.
  const body = "content" in newsItem ? (newsItem.content ?? "").trim() : "";
  const paragraphs = body ? body.split(/\n\s*\n/).filter(Boolean) : [];
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
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="text-gray-700 mb-6 whitespace-pre-line">
                  {paragraph}
                </p>
              ))}

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
