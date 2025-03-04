import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/ui/PageTransition";
import NewsList from "@/components/news/NewsList";

export const metadata: Metadata = {
  title: "News - Parkside Barbershop Harmony Society",
  description: "Latest news and updates from Parkside Harmony and Parkside Melody choruses.",
};

export default function NewsPage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
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
          
          {/* News List - Show all news items */}
          <NewsList 
            title="" 
            maxItems={100} 
            showViewAllButton={false}
          />
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
} 