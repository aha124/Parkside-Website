"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import { useChorus } from "@/contexts/ChorusContext";

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
  autoFilter?: boolean; // Whether to automatically filter by the selected chorus
}

export default function EventsList({
  title = "Upcoming Events",
  maxEvents = 3,
  dataSource = "static",
  jsonUrl = "/data/events.json",
  apiUrl = "/api/events",
  showViewAllButton = false,
  viewAllUrl = "/events",
  showFilters = false,
  autoFilter = true // Default to true - filter events based on chorus context
}: EventsListProps) {
  const { selectedChorus } = useChorus();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>(autoFilter && selectedChorus ? (selectedChorus.charAt(0).toUpperCase() + selectedChorus.slice(1)) : "All");

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
    const formatted = location.replace(/Location:\s*/g, "").trim();
    
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

  // Apply filters to events - memoize with useCallback
  const applyFilters = useCallback((allEvents: Event[], filter: string) => {
    let eventsToShow = allEvents;
    
    // First, filter by chorus context if autoFilter is on
    // Note: This logic assumes selectedChorus is 'harmony', 'melody', or null (for both)
    if (autoFilter && selectedChorus) {
      const chorusName = selectedChorus.charAt(0).toUpperCase() + selectedChorus.slice(1);
      eventsToShow = allEvents.filter(event => 
        event.chorus === chorusName || event.chorus === "Both"
      );
    } else if (autoFilter && selectedChorus === null) {
        // If context is 'both', show all initially before applying UI filter
        eventsToShow = allEvents;
    }

    // Then apply the active UI filter (All, Harmony, Melody, Both)
    if (filter === "All") {
      return eventsToShow; 
    }
    
    return eventsToShow.filter(event => {
      if (filter === "Harmony") {
        return event.chorus === "Harmony" || event.chorus === "Both";
      }
      if (filter === "Melody") {
        return event.chorus === "Melody" || event.chorus === "Both";
      }
      if (filter === "Both") {
        return event.chorus === "Both";
      }
      return true; // Should not happen
    });
  }, [autoFilter, selectedChorus]); // Dependencies for useCallback

  // Effect to update the activeFilter based on chorus context
  useEffect(() => {
    if (autoFilter) {
      let newFilter = "All";
      if (selectedChorus) {
        newFilter = selectedChorus.charAt(0).toUpperCase() + selectedChorus.slice(1);
      }
      if (newFilter !== activeFilter) {
        setActiveFilter(newFilter);
      }
    }
  }, [selectedChorus, autoFilter, activeFilter]);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null); // Reset error on new fetch
      try {
        let fetchedEvents: Event[] = [];
        
        if (dataSource === "json") {
          const response = await fetch(jsonUrl);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          fetchedEvents = await response.json();
        } 
        else if (dataSource === "api") {
          const response = await fetch(apiUrl);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          fetchedEvents = await response.json();
        } 
        else {
          fetchedEvents = staticEvents;
        }
        
        // Sort events by date (assuming date format is parseable or consistent)
        // Consider more robust date parsing if formats vary wildly
        fetchedEvents.sort((a, b) => {
          try {
            const dateA = new Date(a.date.split(' - ')[0]); // Try parsing start date
            const dateB = new Date(b.date.split(' - ')[0]);
            if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0; // Fallback for invalid dates
            return dateA.getTime() - dateB.getTime();
          } catch (e) {
            return 0; // Fallback on parsing error
          }
        });
        
        setEvents(fetchedEvents);
        // We will apply filters in the next effect

      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Using fallback data.");
        setEvents(staticEvents); // Use static data on fetch error
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  // Removed activeFilter and applyFilters from here. 
  // Added staticEvents dependency as it's defined outside.
  }, [dataSource, jsonUrl, apiUrl, staticEvents]); 

  // Update filtered events when filter or events change
  useEffect(() => {
    const filtered = applyFilters(events, activeFilter);
    setFilteredEvents(filtered.slice(0, maxEvents));
  // Added applyFilters as a dependency because it's used here and defined outside (memoized).
  }, [activeFilter, events, maxEvents, applyFilters]); 

  // Get dynamic title - memoized
  const getTitle = useCallback(() => {
    // Simplified logic slightly
    if (activeFilter === "Both") return "Upcoming Joint Events";
    if (activeFilter === "Harmony") return "Upcoming Harmony Events";
    if (activeFilter === "Melody") return "Upcoming Melody Events";
    
    // Default or All
    if (autoFilter && selectedChorus === 'harmony') return "Upcoming Harmony Events";
    if (autoFilter && selectedChorus === 'melody') return "Upcoming Melody Events";
    if (autoFilter && selectedChorus === null) return "All Upcoming Events";
    
    return title; // Fallback to original title prop
  }, [activeFilter, autoFilter, selectedChorus, title]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{getTitle()}</h2>
            {showViewAllButton && (
              <Link 
                href={viewAllUrl}
                className="text-indigo-600 font-medium hover:text-indigo-500 inline-flex items-center group"
              >
                View All Events <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path></svg>
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
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Parkside Harmony
              </button>
              <button
                onClick={() => setActiveFilter("Melody")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === "Melody" 
                    ? "bg-emerald-600 text-white" 
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
                <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {event.chorus && (
                      <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${
                        event.chorus === "Harmony" ? "bg-blue-600 text-white" :
                        event.chorus === "Melody" ? "bg-emerald-600 text-white" :
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
                        className="text-indigo-600 font-medium hover:text-indigo-500 inline-flex items-center group"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Learn More <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path></svg>
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