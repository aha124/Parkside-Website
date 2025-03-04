"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollAnimation from "@/components/ui/ScrollAnimation";

// Define the News type
export interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  imageUrl: string;
  url: string;
}

interface NewsListProps {
  title?: string;
  maxItems?: number;
  showViewAllButton?: boolean;
  viewAllUrl?: string;
}

export default function NewsList({
  title = "Chorus News",
  maxItems = 3,
  showViewAllButton = false,
  viewAllUrl = "/news"
}: NewsListProps) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Static fallback news in case the fetch fails
  const staticNews: NewsItem[] = [
    {
      id: "1",
      title: "Parkside Harmony Welcomes New Music Director",
      date: "February 28, 2025",
      summary: "We're excited to announce our new Music Director who brings 20 years of barbershop experience to our chorus.",
      imageUrl: "/images/news1.jpg",
      url: "/news/new-director"
    },
    {
      id: "2",
      title: "Parkside Wins Excellence in Harmony Award",
      date: "February 15, 2025",
      summary: "Our chorus has been recognized for outstanding musical performance at the regional barbershop competition.",
      imageUrl: "/images/news2.jpg",
      url: "/news/excellence-award"
    },
    {
      id: "3",
      title: "Annual Fundraiser Exceeds Goals",
      date: "January 30, 2025",
      summary: "Thanks to our generous supporters, we've exceeded our fundraising goals for the year, allowing us to expand our community programs.",
      imageUrl: "/images/news1.jpg", // Reusing news1.jpg as fallback
      url: "/news/fundraiser-success"
    }
  ];

  // Helper function to determine if a URL is external
  const isExternalUrl = (url: string) => {
    return url.startsWith('http') || url.startsWith('https');
  };

  // Helper function to get a valid image URL
  const getValidImageUrl = (url: string | undefined) => {
    if (!url) return "/images/news1.jpg";
    
    // If it's an external URL, use it directly
    if (isExternalUrl(url)) return url;
    
    // If it's a local URL starting with /images, use it
    if (url.startsWith('/images')) return url;
    
    // If it's a path from parksideharmony.org, use the full URL
    if (url.includes('parksideharmony.org')) return url;
    
    // Default fallback
    return "/images/news1.jpg";
  };

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // Fetch news from JSON file
        const response = await fetch('/data/news.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.status}`);
        }
        
        const fetchedNews = await response.json();
        
        // If we have news data, use it
        if (fetchedNews && fetchedNews.length > 0) {
          // Map over the fetched news and ensure each item has a valid imageUrl
          const processedNews = fetchedNews.map((item: NewsItem) => ({
            ...item,
            imageUrl: getValidImageUrl(item.imageUrl)
          }));
          
          setNewsItems(processedNews.slice(0, maxItems));
        } else {
          // Otherwise use static news
          setNewsItems(staticNews.slice(0, maxItems));
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news. Using fallback data.");
        setNewsItems(staticNews.slice(0, maxItems));
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [maxItems]);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            {showViewAllButton && (
              <Link 
                href={viewAllUrl}
                className="text-indigo-600 font-medium hover:text-indigo-500"
              >
                View All News →
              </Link>
            )}
          </div>
          {error && <p className="text-amber-600 mb-4">Note: {error}</p>}
        </ScrollAnimation>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Loading skeleton
            Array.from({ length: maxItems }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 w-1/4 mb-2"></div>
                <div className="bg-gray-200 h-6 mb-2"></div>
                <div className="bg-gray-200 h-4 w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-4 w-1/2 mb-4"></div>
                <div className="bg-gray-200 h-4 w-1/4"></div>
              </div>
            ))
          ) : (
            newsItems.map((item) => (
              <ScrollAnimation key={item.id} delay={0.1}>
                <article className="flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-48">
                    {isExternalUrl(item.imageUrl) ? (
                      // For external URLs, use img tag instead of Next.js Image
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to a default image if the image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/news1.jpg";
                        }}
                      />
                    ) : (
                      // For local images, use Next.js Image component
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to a default image if the image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/news1.jpg";
                        }}
                      />
                    )}
                  </div>
                  <div className="p-6 flex-grow">
                    <div className="text-sm font-medium text-gray-500 mb-1">{item.date}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.summary}</p>
                  </div>
                  <div className="px-6 pb-6">
                    <Link 
                      href={item.url}
                      className="text-indigo-600 font-medium hover:text-indigo-500"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              </ScrollAnimation>
            ))
          )}
        </div>
      </div>
    </section>
  );
} 