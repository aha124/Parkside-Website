import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageTransition from "@/components/ui/PageTransition";
import { NewsItem } from "@/components/news/NewsList";

// This is a dynamic route, so we need to generate metadata dynamically
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
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

// Helper function to get a news item by slug
async function getNewsItem(slug: string): Promise<NewsItem | null> {
  try {
    // Fetch all news items
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/data/news.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.status}`);
    }
    
    const newsItems: NewsItem[] = await response.json();
    
    // Find the news item with the matching slug
    // The slug is the last part of the URL, e.g., "recent-performance" from "/news/recent-performance"
    const newsItem = newsItems.find(item => {
      const itemSlug = item.url.split('/').pop();
      return itemSlug === slug;
    });
    
    return newsItem || null;
  } catch (error) {
    console.error("Error fetching news item:", error);
    return null;
  }
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const newsItem = await getNewsItem(slug);
  
  // If the news item doesn't exist, show a 404 page
  if (!newsItem) {
    notFound();
  }
  
  // Helper function to determine if a URL is external
  const isExternalUrl = (url: string) => {
    return url.startsWith('http') || url.startsWith('https');
  };

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
            <p className="text-xl text-white/80 mt-4">
              {newsItem.date}
            </p>
          </div>
        </div>
      </section>
      
      {/* Article Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-[400px]">
              {isExternalUrl(newsItem.imageUrl) ? (
                <img
                  src={newsItem.imageUrl}
                  alt={newsItem.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/news1.jpg";
                  }}
                />
              ) : (
                <Image
                  src={newsItem.imageUrl}
                  alt={newsItem.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/news1.jpg";
                  }}
                />
              )}
            </div>
            
            <div className="p-8">
              <p className="text-lg text-gray-700 mb-6">
                {newsItem.summary}
              </p>
              
              <p className="text-gray-700 mb-6">
                This is a placeholder for the full article content. In a real implementation, 
                you would fetch the complete article content from your CMS or database.
              </p>
              
              <p className="text-gray-700 mb-6">
                For now, we&apos;re displaying the summary as a preview of what this article would contain.
                You can expand this component to include more detailed content as your needs evolve.
              </p>
              
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