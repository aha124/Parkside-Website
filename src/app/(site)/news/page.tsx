import { Metadata } from "next";
import PageTransition from "@/components/ui/PageTransition";
import NewsList from "@/components/news/NewsList";
import { supabase } from "@/app/lib/supabaseClient.ts";
import { News } from "@/components/news/NewsList";

export const metadata: Metadata = {
  title: "News - Parkside Barbershop Harmony Society",
  description: "Latest news and updates from Parkside Harmony and Parkside Melody choruses.",
};

export default async function NewsPage() {
  let fetchedNews: News[] = [];
  let newsError: string | null = null;

  try {
    const { data: newsData, error: newsErr } = await supabase
      .from('news')
      .select('id, created_at, published_date, title, content, image_url, author')
      .order('published_date', { ascending: false });
      
    if (newsErr) throw newsErr;
    fetchedNews = (newsData as News[]) || [];
  } catch (error) {
    console.error("Error fetching news for news page:", error);
    newsError = "Could not load news articles at this time.";
  }

  return (
    <PageTransition>
      {/* Page Header */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            Chorus News
          </h1>
          <p className="text-xl text-white/80 text-center max-w-3xl mx-auto mt-4">
            Stay updated with the latest news, events, and achievements from Parkside Harmony and Parkside Melody.
          </p>
        </div>
      </section>
      
      {/* News List - Show all fetched news items */}
      {newsError ? (
        <div className="container mx-auto px-4 py-16 text-center text-red-600"><p>{newsError}</p></div>
      ) : (
        <NewsList 
          title=""
          initialNews={fetchedNews}
          showViewAllButton={false}
        />
      )}
    </PageTransition>
  );
} 