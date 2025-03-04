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
  startTime?: string;
  endTime?: string;
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
  showViewAllButton?: boolean;
  viewAllUrl?: string;
  showFilters?: boolean;
}

export default function EventsList({
  title = "Upcoming Events",
  maxEvents = 3,
  dataSource = "static",
  jsonUrl = "/data/events.json",
  apiUrl = "/api/events",
  showViewAllButton = false,
  viewAllUrl = "/events",
  showFilters = false
}: EventsListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");

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

  // Helper function to format location string
  const formatLocation = (location: string): string => {
    if (!location) return "";
    
    // Remove "Location:" and clean up whitespace
    let formatted = location.replace(/Location:\s*/g, "").trim();
    
    // Extract just the venue name and city
    const lines = formatted.split('\n').map(line => line.trim()).filter(Boolean);
    if (lines.length >= 2) {
      const venue = lines[0];
      const city = lines.find(line => !line.match(/^\d+$/) && !line.includes("See map") && !line.includes("United States"));
      
      if (venue && city) {
        return `${venue}, ${city.replace(/,\s*$/, "")}`;
      }
    }
    
    // Fallback to a simplified version
    return formatted.split('\n').slice(0, 2).join(', ').replace(/\s+/g, ' ').trim();
  };

  // Apply filters to events
  const applyFilters = (allEvents: Event[], filter: string) => {
    if (filter === "All") {
      return allEvents;
    }
    
    return allEvents.filter(event => {
      if (filter === "Harmony") {
        return event.chorus === "Harmony" || event.chorus === "Both";
      }
      if (filter === "Melody") {
        return event.chorus === "Melody" || event.chorus === "Both";
      }
      if (filter === "Both") {
        return event.chorus === "Both";
      }
      return true;
    });
  };

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
        
        // Sort events by date
        fetchedEvents.sort((a, b) => {
          // Handle various date formats
          const dateA = new Date(a.date.replace(/(\w{3})\s+(\d+),?\s+(\d{4})/, "$1 $2 $3"));
          const dateB = new Date(b.date.replace(/(\w{3})\s+(\d+),?\s+(\d{4})/, "$1 $2 $3"));
          
          // If dates can't be parsed, try a simple string comparison
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            return a.date.localeCompare(b.date);
          }
          
          return dateA.getTime() - dateB.getTime();
        });
        
        setEvents(fetchedEvents);
        // Apply initial filtering
        setFilteredEvents(applyFilters(fetchedEvents, activeFilter).slice(0, maxEvents));
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Using fallback data.");
        setEvents(staticEvents);
        setFilteredEvents(staticEvents.slice(0, maxEvents));
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [dataSource, jsonUrl, apiUrl, maxEvents]);

  // Update filtered events when filter changes
  useEffect(() => {
    setFilteredEvents(applyFilters(events, activeFilter).slice(0, maxEvents));
  }, [activeFilter, events, maxEvents]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            {showViewAllButton && (
              <Link 
                href={viewAllUrl}
                className="text-indigo-600 font-medium hover:text-indigo-500"
              >
                View All Events →
              </Link>
            )}
          </div>
          {error && <p className="text-amber-600 mb-4">Note: {error}</p>}
        </ScrollAnimation>
        
        {showFilters && (
          <ScrollAnimation>
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setActiveFilter("All")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === "All" 
                    ? "bg-gray-900 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => setActiveFilter("Harmony")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === "Harmony" 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Parkside Harmony
              </button>
              <button
                onClick={() => setActiveFilter("Melody")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === "Melody" 
                    ? "bg-pink-500 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Parkside Melody
              </button>
              <button
                onClick={() => setActiveFilter("Both")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === "Both" 
                    ? "bg-purple-500 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Joint Events
              </button>
            </div>
          </ScrollAnimation>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
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
                    <div className="text-sm font-medium text-indigo-600 mb-1">
                      {event.date}
                      {event.startTime && ` • ${event.startTime}`}
                      {event.endTime && ` - ${event.endTime}`}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    {event.location && (
                      <div className="text-sm text-gray-500 mb-2">
                        <span className="inline-block mr-1">📍</span> {formatLocation(event.location)}
                      </div>
                    )}
                    <p className="text-gray-600 mb-4">{event.description}</p>
                  </div>
                  {event.url && (
                    <div className="px-6 pb-6">
                      <Link 
                        href={event.url}
                        className="text-indigo-600 font-medium hover:text-indigo-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Learn More →
                      </Link>
                    </div>
                  )}
                </div>
              </ScrollAnimation>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">
              There are no upcoming events matching your filter criteria.
            </p>
          </div>
        )}
      </div>
    </section>
  );
} 