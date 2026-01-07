"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import { useChorus, shouldShowForChorus } from "@/lib/chorus-context";

// Define the News type
export interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  imageUrl: string;
  url: string;
  chorus?: string; // e.g., "harmony", "melody", or "voices"
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
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { chorus: selectedChorus } = useChorus();

  // Static fallback news in case the fetch fails
  const staticNews: NewsItem[] = [
    {
      id: "1",
      title: "Parkside Harmony Welcomes New Music Director",
      date: "February 28, 2025",
      summary: "We're excited to announce our new Music Director who brings 20 years of barbershop experience to our chorus.",
      imageUrl: "/images/news1.jpg",
      url: "/news/new-director",
      chorus: "harmony"
    },
    {
      id: "2",
      title: "Parkside Wins Excellence in Harmony Award",
      date: "February 15, 2025",
      summary: "Our chorus has been recognized for outstanding musical performance at the regional barbershop competition.",
      imageUrl: "/images/news2.jpg",
      url: "/news/excellence-award",
      chorus: "voices"
    },
    {
      id: "3",
      title: "Annual Fundraiser Exceeds Goals",
      date: "January 30, 2025",
      summary: "Thanks to our generous supporters, we've exceeded our fundraising goals for the year, allowing us to expand our community programs.",
      imageUrl: "/images/news1.jpg",
      url: "/news/fundraiser-success",
      chorus: "voices"
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

  // Helper function to get the correct URL for news items
  const getNewsUrl = (url: string) => {
    // If it's an external URL, use it directly
    if (isExternalUrl(url)) return url;
    
    // If it's a node URL from Parkside Harmony (e.g., /node/6061)
    if (url.startsWith('/node/')) {
      return `https://parksideharmony.org${url}`;
    }
    
    // If it's a local URL, use it as is
    return url;
  };

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // Fetch news from API (merges scraped JSON with admin KV)
        const response = await fetch('/api/news');
        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.status}`);
        }

        const fetchedNews = await response.json();

        // If we have news data, use it
        if (fetchedNews && fetchedNews.length > 0) {
          // Map over the fetched news and ensure each item has valid URLs
          const processedNews = fetchedNews.map((item: NewsItem) => ({
            ...item,
            imageUrl: getValidImageUrl(item.imageUrl),
            // Ensure the URL is properly formatted
            url: item.url || '/news'
          }));

          setAllNews(processedNews);
        } else {
          // Otherwise use static news
          setAllNews(staticNews);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news. Using fallback data.");
        setAllNews(staticNews);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Filter news by selected chorus
  useEffect(() => {
    const filtered = allNews
      .filter(item => shouldShowForChorus(item.chorus, selectedChorus))
      .slice(0, maxItems);
    setNewsItems(filtered);
  }, [allNews, selectedChorus, maxItems]);

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
                    {item.chorus && (
                      <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${
                        item.chorus.toLowerCase() === "harmony" ? "bg-indigo-500 text-white" :
                        item.chorus.toLowerCase() === "melody" ? "bg-amber-500 text-white" :
                        "bg-purple-500 text-white"
                      }`}>
                        {item.chorus.toLowerCase() === "voices" ? "Harmony & Melody" : `Parkside ${item.chorus.charAt(0).toUpperCase() + item.chorus.slice(1)}`}
                      </div>
                    )}
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
                        className="text-indigo-600 font-medium hover:text-indigo-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Read More →
                      </a>
                    ) : (
                      <Link 
                        href={item.url}
                        className="text-indigo-600 font-medium hover:text-indigo-500"
                      >
                        Read More →
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