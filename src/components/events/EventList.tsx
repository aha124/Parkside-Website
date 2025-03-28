"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { useChorus } from "@/contexts/ChorusContext";
import { EventType } from "@/types";
import chorusContent from "@/data/chorusContent";
import useChorusStyles from "@/hooks/useChorusStyles";

interface EventListProps {
  events: EventType[];
}

export default function EventList({ events }: EventListProps) {
  const { selectedChorus } = useChorus();
  const { buttonStyle, primaryTextClass } = useChorusStyles();
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>(events);

  useEffect(() => {
    // Filter events based on selected chorus
    if (selectedChorus) {
      const filtered = events.filter(
        event => event.chorus === selectedChorus || event.chorus === 'both'
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  }, [events, selectedChorus]);

  // Get the appropriate title based on the selected chorus
  const getTitle = () => {
    if (selectedChorus === 'harmony') {
      return "Parkside Harmony Events";
    } else if (selectedChorus === 'melody') {
      return "Parkside Melody Events";
    }
    return "Upcoming Events";
  };

  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">{getTitle()}</h2>
        <p className="text-lg text-gray-600">
          No upcoming events are currently scheduled for {selectedChorus ? chorusContent[selectedChorus].fullName : 'our choruses'}.
          Please check back soon!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">{getTitle()}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <Image
                src={event.image || "/images/event-placeholder.jpg"}
                alt={event.title}
                fill
                className="object-cover"
              />
              {event.chorus !== 'both' && event.chorus !== null && (
                <div className="absolute top-3 right-3 bg-white text-sm font-medium py-1 px-2 rounded-md shadow-sm">
                  {event.chorus === 'harmony' ? 'Harmony' : 'Melody'}
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-500 text-sm">
                  {format(parseISO(event.date), "MMM dd, yyyy")} • {event.time}
                </p>
                <h3 className="text-xl font-bold text-gray-800 mt-2">{event.title}</h3>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{event.location}</span>
              </div>
              <Link
                href={`/events/${event.id}`}
                className="inline-block font-medium py-2 px-4 rounded-md transition-colors"
                style={buttonStyle}
              >
                View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 