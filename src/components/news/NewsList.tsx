"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import { parseISO, format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Define the News type matching Supabase schema
export interface News {
  id: string; // uuid
  created_at?: string; // timestamptz
  updated_at?: string; // timestamptz
  published_date: string; // timestamptz
  title: string; // text
  content: string; // text
  author?: string | null; // text (nullable)
  image_url?: string | null; // text (nullable)
}

interface NewsListProps {
  title?: string;
  initialNews: News[]; // Changed: Accept initialNews prop
  maxItems?: number;
  showViewAllButton?: boolean;
  viewAllUrl?: string;
}

export default function NewsList({
  title = "Chorus News",
  initialNews, // Changed: Use initialNews
  maxItems = Infinity, // Default to showing all passed items unless specified
  showViewAllButton = false,
  viewAllUrl = "/news"
}: NewsListProps) {
  // Removed internal state for loading, error, and fetched newsItems
  // We now directly use the initialNews prop, applying maxItems limit if needed
  const newsItemsToDisplay = useMemo(() => initialNews?.slice(0, maxItems) || [], [initialNews, maxItems]);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  // Removed staticNews definition
  // Removed isExternalUrl, getValidImageUrl, getNewsUrl helpers
  // Removed useEffect hook for fetching data

  // Helper to format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Date Unknown";
    try {
      return format(parseISO(dateString), "MMMM d, yyyy");
    } catch (e) {
      console.error("Error parsing news date:", e);
      return "Date Invalid";
    }
  };

  // Function to open dialog
  const handleNewsClick = (newsItem: News) => {
    setSelectedNews(newsItem);
  };

  // Function to handle dialog open/close state changes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedNews(null);
    }
  };

  return (
    <Dialog open={selectedNews !== null} onOpenChange={handleOpenChange}>
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
            {/* Removed error display logic as fetching is done server-side */}
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Removed loading skeleton as data is pre-fetched */}
            {newsItemsToDisplay.length > 0 ? (
              newsItemsToDisplay.map((item) => (
                <ScrollAnimation key={item.id} delay={0.1}>
                  <DialogTrigger asChild onClick={() => handleNewsClick(item)}>
                    <article className="flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                      {item.image_url && ( // Check if image exists
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={item.image_url} // Use image_url
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/images/news1.jpg"; // Keep fallback
                            }}
                          />
                        </div>
                      )}
                      <div className="p-6 flex-grow">
                        <div className="text-sm font-medium text-gray-500 mb-1">
                          {formatDate(item.published_date)} {/* Use published_date and format */}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-4">{item.content}</p> {/* Use content, adjust line-clamp */}
                      </div>
                    </article>
                  </DialogTrigger>
                </ScrollAnimation>
              ))
            ) : (
               <div className="col-span-full bg-white p-8 rounded-lg shadow-md text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No news found</h3>
                  <p className="text-gray-600">
                    There are currently no news articles available.
                  </p>
               </div>
            )}
          </div>
        </div>
      </section>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{selectedNews?.title}</DialogTitle>
          {selectedNews?.published_date && (
            <DialogDescription className="pt-1">
              Published: {formatDate(selectedNews.published_date)}
              {selectedNews.author && ` by ${selectedNews.author}`}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
          {selectedNews?.image_url && (
            <div className="relative h-64 w-full mb-4 rounded overflow-hidden">
              <Image
                src={selectedNews.image_url}
                alt={selectedNews.title}
                fill
                className="object-contain" 
              />
            </div>
          )}
          <div 
            className="text-sm text-gray-700 whitespace-pre-wrap prose prose-sm max-w-none"
          >
            {selectedNews?.content}
          </div>
        </div>
        <DialogClose asChild>
            <Button type="button" variant="secondary" className="mt-4">
              Close
            </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
} 