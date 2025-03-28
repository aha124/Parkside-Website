import { Metadata } from "next";
import PageTransition from "@/components/ui/PageTransition";
import EventsList from "@/components/events/EventsList";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import ChorusHero from "@/components/ui/ChorusHero";

export const metadata: Metadata = {
  title: "Events - Parkside Barbershop Harmony",
  description: "Upcoming performances and events for Parkside Harmony and Parkside Melody choruses.",
};

export default function EventsPage() {
  return (
    <PageTransition>
      {/* Page Header */}
      <ChorusHero
        page="events"
        title="Events Calendar"
        description="Find upcoming performances, competitions, and community events featuring Parkside Harmony and Parkside Melody choruses."
        height="70vh"
      />
      
      {/* Events List */}
      <EventsList 
        title="All Upcoming Events" 
        maxEvents={100} 
        dataSource="json" 
        jsonUrl="/data/events.json" 
        showFilters={true}
      />
      
      {/* Calendar Integration Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Stay Updated</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl">
              Never miss a Parkside event! Subscribe to our calendar or follow us on social media for the latest updates.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Google Calendar */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-2xl mb-4">📅</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Google Calendar</h3>
                <p className="text-gray-600 mb-4">
                  Add our events directly to your Google Calendar to receive automatic updates.
                </p>
                <a 
                  href="#" 
                  className="text-indigo-600 font-medium hover:text-indigo-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Subscribe to Calendar →
                </a>
              </div>
              
              {/* iCalendar */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-2xl mb-4">🗓️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">iCalendar Feed</h3>
                <p className="text-gray-600 mb-4">
                  Use our iCal feed to import events into Apple Calendar, Outlook, or other calendar apps.
                </p>
                <a 
                  href="#" 
                  className="text-indigo-600 font-medium hover:text-indigo-500"
                >
                  Get iCal Link →
                </a>
              </div>
              
              {/* Social Media */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-2xl mb-4">📱</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Social Media</h3>
                <p className="text-gray-600 mb-4">
                  Follow us on social media for event announcements, behind-the-scenes content, and more.
                </p>
                <a 
                  href="#" 
                  className="text-indigo-600 font-medium hover:text-indigo-500"
                >
                  Connect With Us →
                </a>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </PageTransition>
  );
} 