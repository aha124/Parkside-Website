import { Metadata } from "next";
import PageTransition from "@/components/ui/PageTransition";
import EventsList from "@/components/events/EventsList";
import NewsList from "@/components/news/NewsList";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import ChorusesSection from "@/components/home/ChorusesSection";

export const metadata: Metadata = {
  title: "Parkside - Hershey Chapter of the Barbershop Harmony Society",
  description: "Welcome to Parkside - home of Parkside Harmony and Parkside Melody a cappella choruses.",
};

export default function HomePage() {
  return (
    <PageTransition>
      {/* Hero Section with Slideshow */}
      <HeroSlideshow interval={6000} />

      {/* Events Section */}
      <EventsList
        title="Upcoming Events"
        maxEvents={3}
        dataSource="api"
        apiUrl="/api/events"
        showViewAllButton={true}
        viewAllUrl="/events"
      />

      {/* News Section */}
      <NewsList 
        title="Chorus News" 
        maxItems={3} 
        showViewAllButton={true}
        viewAllUrl="/news"
      />

      {/* Choruses Section */}
      <ChorusesSection />
    </PageTransition>
  );
} 