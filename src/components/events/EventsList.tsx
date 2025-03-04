"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollAnimation from "@/components/ui/ScrollAnimation";

// Define the Event type
export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  url?: string;
  location?: string;
  chorus?: string; // e.g., "Harmony", "Melody", or "Both"
}

interface EventsListProps {
  title?: string;
  maxEvents?: number;
  dataSource?: "static" | "json" | "api";
  jsonUrl?: string;
  apiUrl?: string;
}

export default function EventsList({
  title = "Upcoming Events",
  maxEvents = 3,
  dataSource = "static",
  jsonUrl = "/data/events.json",
  apiUrl = "/api/events"
}: EventsListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Static fallback events in case the fetch fails
  const staticEvents: Event[] = [
    {
      id: "1",
      title: "Spring Harmony Concert",
      date: "March 15, 2025",
      description: "Join us for our annual Spring Concert featuring both Parkside Harmony and Parkside Melody choruses.",
      imageUrl: "/images/event1.jpg",
      url: "/events/spring-concert",
      location: "Hershey Theatre",
      chorus: "Both"
    },
    {
      id: "2",
      title: "Mid-Atlantic District Competition",
      date: "April 5-7, 2025",
      description: "Cheer on Parkside Harmony as they compete in the Mid-Atlantic District Barbershop Competition.",
      imageUrl: "/images/event2.jpg",
      url: "/events/district-competition",
      location: "Baltimore Convention Center",
      chorus: "Harmony"
    },
    {
      id: "3",
      title: "Community Outreach Performance",
      date: "March 28, 2025",
      description: "Parkside Melody will be performing at the Hershey Community Center to support local charities.",
      imageUrl: "/images/event3.jpg",
      url: "/events/community-performance",
      location: "Hershey Community Center",
      chorus: "Melody"
    }
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        let fetchedEvents: Event[] = [];
        
        if (dataSource === "json") {
          // Fetch from JSON file
          const response = await fetch(jsonUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.status}`);
          }
          fetchedEvents = await response.json();
        } 
        else if (dataSource === "api") {
          // Fetch from API endpoint
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.status}`);
          }
          fetchedEvents = await response.json();
        } 
        else {
          // Use static events
          fetchedEvents = staticEvents;
        }
        
        // Sort events by date (assuming date strings are in a format that sorts correctly)
        fetchedEvents.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });
        
        // Limit to maxEvents
        setEvents(fetchedEvents.slice(0, maxEvents));
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Using fallback data.");
        setEvents(staticEvents.slice(0, maxEvents));
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [dataSource, jsonUrl, apiUrl, maxEvents]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>
          {error && <p className="text-amber-600 mb-4">Note: {error}</p>}
        </ScrollAnimation>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <ScrollAnimation key={event.id} delay={0.1 * index}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
                  <div className="relative h-48">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                    {event.chorus && (
                      <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${
                        event.chorus === "Harmony" ? "bg-blue-500 text-white" :
                        event.chorus === "Melody" ? "bg-pink-500 text-white" :
                        "bg-purple-500 text-white"
                      }`}>
                        {event.chorus === "Both" ? "Harmony & Melody" : `Parkside ${event.chorus}`}
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-grow">
                    <div className="text-sm font-medium text-indigo-600 mb-1">{event.date}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    {event.location && (
                      <div className="text-sm text-gray-500 mb-2">
                        <span className="inline-block mr-1">📍</span> {event.location}
                      </div>
                    )}
                    <p className="text-gray-600 mb-4">{event.description}</p>
                  </div>
                  {event.url && (
                    <div className="px-6 pb-6">
                      <Link 
                        href={event.url}
                        className="text-indigo-600 font-medium hover:text-indigo-500"
                      >
                        Learn More →
                      </Link>
                    </div>
                  )}
                </div>
              </ScrollAnimation>
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 