"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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

  // Static fallback news - memoize
  const staticNews = useMemo<NewsItem[]>(() => [
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
  ], []);

  // Helper function to determine if a URL is external - memoize
  const isExternalUrl = useCallback((url: string) => {
    return url.startsWith('http') || url.startsWith('https');
  }, []);

  // Helper function to get a valid image URL - memoize
  const getValidImageUrl = useCallback((url: string | undefined) => {
    if (!url) return "/images/news1.jpg";
    if (isExternalUrl(url)) return url;
    if (url.startsWith('/images')) return url;
    if (url.includes('parksideharmony.org')) return url;
    return "/images/news1.jpg";
  }, [isExternalUrl]); // Dependency: isExternalUrl

  // Helper function to get the correct URL for news items - memoize
  const getNewsUrl = useCallback((url: string) => {
    if (isExternalUrl(url)) return url;
    if (url.startsWith('/node/')) {
      return `https://parksideharmony.org${url}`;
    }
    return url;
  }, [isExternalUrl]); // Dependency: isExternalUrl

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch('/data/news.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.status}`);
        }
        const fetchedNews = await response.json();
        
        if (fetchedNews && fetchedNews.length > 0) {
          const processedNews = fetchedNews.map((item: NewsItem) => ({
            ...item,
            imageUrl: getValidImageUrl(item.imageUrl), // Now uses memoized version
            url: item.url || '/news'
          }));
          setNewsItems(processedNews.slice(0, maxItems));
        } else {
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
  // Add getValidImageUrl as it's used in the fetch logic
  // staticNews is memoized, maxItems is stable
  }, [maxItems, staticNews, getValidImageUrl]);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            {showViewAllButton && (
              <Link 
                href={viewAllUrl}
                className="text-indigo-600 font-medium hover:text-indigo-500 inline-flex items-center group"
              >
                View All News <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path></svg>
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
                <article className="flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden">
                    {/* Always use Next/Image for consistency and optimization */}
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        // Fallback to a default image if the image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/news1.jpg";
                      }}
                    />
                  </div>
                  <div className="p-6 flex-grow">
                    <div className="text-sm font-medium text-gray-500 mb-1">{item.date}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.summary}</p>
                  </div>
                  <div className="px-6 pb-6">
                    {isExternalUrl(item.url) || item.url.startsWith('/node/') ? (
                      <a 
                        href={getNewsUrl(item.url)}
                        className="text-indigo-600 font-medium hover:text-indigo-500 inline-flex items-center group"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Read More <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path></svg>
                      </a>
                    ) : (
                      <Link 
                        href={item.url}
                        className="text-indigo-600 font-medium hover:text-indigo-500 inline-flex items-center group"
                      >
                        Read More <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path></svg>
                      </Link>
                    )}
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