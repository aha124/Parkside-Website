"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import { useChorus } from "@/contexts/ChorusContext";
import { startOfDay, parseISO } from 'date-fns';
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

// Define the Event type to match Supabase schema
export interface Event {
  id: string; // uuid
  created_at?: string; // timestamptz
  updated_at?: string; // timestamptz
  title: string; // text
  event_date: string; // timestamptz (will be string like '2024-07-28T10:00:00+00:00')
  description: string; // text
  image_url?: string | null; // text (nullable)
  location?: string | null; // text (nullable)
  chorus?: 'Harmony' | 'Melody' | 'Both' | null; // text (nullable) - Assuming these are the only values
  // Removed: startTime, endTime, url
}

interface EventsListProps {
  title?: string;
  initialEvents: Event[]; // Changed: Accept events directly
  maxEvents?: number;
  showViewAllButton?: boolean;
  viewAllUrl?: string;
  showFilters?: boolean;
  autoFilter?: boolean;
  // Removed: dataSource, jsonUrl, apiUrl
}

export default function EventsList({
  title = "Upcoming Events",
  initialEvents, // Changed: Use initialEvents
  maxEvents = 3,
  showViewAllButton = false,
  viewAllUrl = "/events",
  showFilters = false,
  autoFilter = true
  // Removed: dataSource, jsonUrl, apiUrl from props destructuring
}: EventsListProps) {
  const { selectedChorus } = useChorus();
  const [events] = useState<Event[]>(initialEvents || []);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>(autoFilter && selectedChorus ? (selectedChorus.charAt(0).toUpperCase() + selectedChorus.slice(1)) : "All");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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
  const applyFilters = useCallback((allEvents: Event[], uiFilter: string) => {
    const startOfToday = startOfDay(new Date());
    // console.log(`[EventsList] applyFilters called. UI Filter: ${uiFilter}`); // Removed log
    // console.log('[EventsList] Filtering Events. Start of Today:', startOfToday);
    // console.log('[EventsList] All Events Input:', allEvents);

    // --- 1. Filter out past events ---
    const futureEvents = allEvents.filter(event => {
      try {
        // Use event_date and parseISO for timestamptz
        const eventStartDate = parseISO(event.event_date);
        const isFuture = !isNaN(eventStartDate.getTime()) && eventStartDate >= startOfToday;
        // console.log(`[EventsList] Event: ${event.title}, Date: ${event.event_date}, Parsed: ${eventStartDate}, Is Future: ${isFuture}`); // Removed log
        // Check if date is valid and not in the past
        return isFuture;
      } catch (e) {
        console.error(`Error parsing event date ${event.event_date}:`, e);
        return false; // Exclude if date parsing fails
      }
    });
    // console.log('[EventsList] Future Events:', futureEvents); // Removed log
    // console.log('[EventsList] Future Events after date filter:', futureEvents);

    // --- 2. Apply the active UI filter (All, Harmony, Melody, Both) ---
    if (uiFilter === "All") {
      // console.log('[EventsList] Returning all future events.'); // Removed log
      return futureEvents;
    }

    const finalFiltered = futureEvents.filter(event => {
      const eventChorus = event.chorus; // Might be null, 'Harmony', 'Melody', 'Both'
      if (uiFilter === "Harmony") {
        return eventChorus === "Harmony" || eventChorus === "Both";
      }
      if (uiFilter === "Melody") {
        return eventChorus === "Melody" || eventChorus === "Both";
      }
      if (uiFilter === "Both") {
        return eventChorus === "Both";
      }
      return false; // Should not happen if filter is valid
    });
    // console.log('[EventsList] Final Filtered Events:', finalFiltered); // Removed log
    return finalFiltered;

  }, []); // Removed dependencies on autoFilter/selectedChorus

  // Effect to sync activeFilter with context
  useEffect(() => {
    if (autoFilter) {
      let newFilter = "All";
      if (selectedChorus) {
        newFilter = selectedChorus.charAt(0).toUpperCase() + selectedChorus.slice(1);
      }
      // Use functional update to avoid needing activeFilter in deps
      setActiveFilter(currentActiveFilter => {
        if (newFilter !== currentActiveFilter) {
          return newFilter; // Set to the context-derived filter
        }
        return currentActiveFilter; // Keep the current filter
      });
    }
  }, [selectedChorus, autoFilter]); // Dependency array is now correct

  // Effect to update filteredEvents when filter or events change
  useEffect(() => {
    const filtered = applyFilters(events, activeFilter);
    setFilteredEvents(filtered.slice(0, maxEvents));
  }, [activeFilter, events, maxEvents, applyFilters]); // Add activeFilter and applyFilters back

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

  // Function to open dialog
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  // Function to handle dialog open/close state changes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedEvent(null);
    }
  };

  return (
    <Dialog open={selectedEvent !== null} onOpenChange={handleOpenChange}> {/* Control Dialog state */}
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
          </ScrollAnimation>
          
          {showFilters && (
            <ScrollAnimation>
              <div className="flex flex-wrap gap-2 mb-8">
                <button
                  onClick={() => {
                    // console.log('[EventsList] Setting activeFilter to: All'); // Removed log
                    setActiveFilter("All");
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === "All" 
                      ? "bg-gray-900 text-white" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All Events
                </button>
                <button
                  onClick={() => {
                    // console.log('[EventsList] Setting activeFilter to: Harmony'); // Removed log
                    setActiveFilter("Harmony");
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === "Harmony" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Parkside Harmony
                </button>
                <button
                  onClick={() => {
                    // console.log('[EventsList] Setting activeFilter to: Melody'); // Removed log
                    setActiveFilter("Melody");
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === "Melody" 
                      ? "bg-emerald-600 text-white" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Parkside Melody
                </button>
                <button
                  onClick={() => {
                    // console.log('[EventsList] Setting activeFilter to: Both'); // Removed log
                    setActiveFilter("Both");
                  }}
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
          
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => (
                <ScrollAnimation key={event.id} delay={0.1 * index}>
                  {/* Wrap card content with DialogTrigger */}
                  <DialogTrigger asChild onClick={() => handleEventClick(event)}>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
                      {event.image_url && ( // Check if image_url exists
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={event.image_url} // Changed: use image_url
                            alt={event.title}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-105"
                          />
                          {event.chorus && (
                            <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${
                              event.chorus === "Harmony" ? "bg-blue-600 text-white" :
                              event.chorus === "Melody" ? "bg-emerald-600 text-white" :
                              event.chorus === "Both" ? "bg-purple-500 text-white" : // Added case for Both explicitly
                              "bg-gray-500 text-white" // Fallback style if needed
                            }`}>
                              {event.chorus === "Both" ? "Harmony & Melody" : `Parkside ${event.chorus}`}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-6 flex-grow">
                        <div className="text-sm font-medium text-indigo-600 mb-1">
                          {/* Format event_date - assumes parseISO works */}
                          {event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }) : 'Date TBD'}
                          {/* Removed startTime / endTime */}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                        {event.location && (
                          <div className="text-sm text-gray-500 mb-2">
                            <span className="inline-block mr-1">📍</span> {formatLocation(event.location)}
                          </div>
                        )}
                        <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p> {/* Adjusted line-clamp */}
                      </div>
                    </div>
                  </DialogTrigger>
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

      {/* Dialog Content - Renders outside the section, controlled by Dialog state */}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{selectedEvent?.title}</DialogTitle>
          {selectedEvent?.event_date && (
            <DialogDescription className="pt-1">
              {new Date(selectedEvent.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
              {/* Add time if available/needed */}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {selectedEvent?.image_url && (
            <div className="relative h-64 w-full mb-4 rounded overflow-hidden">
              <Image
                src={selectedEvent.image_url}
                alt={selectedEvent.title}
                fill
                className="object-contain" // Use contain to show whole image, or cover?
              />
            </div>
          )}
          {selectedEvent?.location && (
            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Location:</span> {formatLocation(selectedEvent.location)}
            </p>
          )}
          {/* Display full description */}
          <p className="text-sm text-gray-700 whitespace-pre-wrap"> 
            {selectedEvent?.description}
          </p>
        </div>
        {/* Removed DialogFooter, using DialogClose directly */}
        <DialogClose asChild>
            <Button type="button" variant="secondary" className="mt-4">
              Close
            </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
} 