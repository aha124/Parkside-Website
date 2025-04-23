import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageTransition from "@/components/ui/PageTransition";
import { News } from "@/components/news/NewsList";
import { supabase } from "@/app/lib/supabaseClient.ts";
import { format, parseISO } from 'date-fns';

// Removed unused type alias
// type PageParams = { slug: string };

// Helper function to get a news item by ID (slug)
// Assuming the slug parameter is the UUID of the news article
async function getNewsItem(id: string): Promise<News | null> {
  if (!id) return null;
  try {
    const { data, error } = await supabase
      .from('news')
      .select('id, created_at, published_date, title, content, image_url, author')
      .eq('id', id) // Fetch by UUID
      .single(); // Expect only one result

    if (error) {
      // Log the error but return null to trigger notFound()
      console.error("Error fetching news item:", error.message);
      return null;
    }
    return data as News | null;
  } catch (error) {
    // Catch any other potential errors during fetch
    console.error("Unexpected error fetching news item:", error);
    return null;
  }
}

// generateMetadata function expecting params as a Promise
export async function generateMetadata({ params: paramsPromise }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await paramsPromise; // Await the promise
  const newsItem = await getNewsItem(params.slug);
  
  if (!newsItem) {
    return {
      title: "News Article Not Found - Parkside",
      description: "The requested news article could not be found.",
    };
  }
  
  return {
    title: `${newsItem.title} - Parkside News`,
    // Use first part of content for description, ensure content exists
    description: newsItem.content ? newsItem.content.substring(0, 150) + '...' : "Read the latest news from Parkside.",
  };
}

// News Article Page Component expecting params as a Promise
export default async function NewsArticlePage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = await paramsPromise; // Await the promise
  const newsItem = await getNewsItem(params.slug);
  
  if (!newsItem) {
    notFound(); // Trigger 404 page
  }

  // Helper to format date (could be moved to utils)
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return null;
    try {
      return format(parseISO(dateString), "MMMM d, yyyy");
    } catch { return null; }
  };
  
  const formattedDate = formatDate(newsItem.published_date);

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
            {formattedDate && (
              <p className="text-xl text-white/80 mt-4">
                Published on {formattedDate}
                {newsItem.author && ` by ${newsItem.author}`}
              </p>
            )}
          </div>
        </div>
      </section>
      
      {/* Article Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {newsItem.image_url && ( // Check if image exists
              <div className="relative h-[400px]">
                <Image
                  src={newsItem.image_url} 
                  alt={newsItem.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/news1.jpg"; // Fallback still needed?
                  }}
                  priority // Prioritize loading header image
                />
              </div>
            )}
            
            <div className="p-8 prose prose-lg max-w-none"> {/* Use Tailwind prose for styling */}
              {/* Render the full content */}
              {/* Consider using Markdown renderer if content is Markdown */}
              <div className="whitespace-pre-wrap">
                {newsItem.content}
              </div>
              
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