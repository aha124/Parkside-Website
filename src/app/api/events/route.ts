import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Event } from '@/components/events/EventsList';

// This is a placeholder for a real API that would fetch from ChoirGenius
// In a production environment, you would use a proper API client or database
export async function GET() {
  try {
    // For demo purposes, we're reading from the JSON file
    // In production, this would be replaced with a call to an external API or database
    const filePath = path.join(process.cwd(), 'public', 'data', 'events.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const events: Event[] = JSON.parse(fileContents);
    
    // Sort events by date
    events.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
    
    // Filter out past events (in a real implementation)
    const currentDate = new Date();
    const upcomingEvents = events.filter(event => {
      // This is a simple implementation - in reality, you'd need to handle date ranges
      // and different date formats more robustly
      const eventDate = new Date(event.date.split(' - ')[0]);
      return eventDate >= currentDate;
    });
    
    return NextResponse.json(upcomingEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// In a real implementation, you might also want to add POST, PUT, DELETE methods
// to allow for event creation and management through an admin interface 