import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageTransition from "@/components/ui/PageTransition";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import EventsList from "@/components/events/EventsList";
import NewsList from "@/components/news/NewsList";
import HeroSlideshow from "@/components/home/HeroSlideshow";

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
        dataSource="json" 
        jsonUrl="/data/events.json" 
        showViewAllButton={true}
        viewAllUrl="/events"
        autoFilter={true}
      />

      {/* News Section */}
      <NewsList 
        title="Chorus News" 
        maxItems={3} 
        showViewAllButton={true}
        viewAllUrl="/news"
      />

      {/* Choruses Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Choruses</h2>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Parkside Harmony */}
            <ScrollAnimation delay={0.1} direction="left">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
                  <Image
                    src="/images/harmony-bg.jpg"
                    alt="Parkside Harmony"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Parkside Harmony</h3>
                <p className="text-gray-600 mb-4">
                  Our competitive men's chorus that performs traditional and contemporary a cappella music in the barbershop style. Founded in 2010, Parkside Harmony has competed at the district and international levels.
                </p>
                <Link 
                  href="/choruses/harmony"
                  className="text-indigo-600 font-medium hover:text-indigo-500"
                >
                  Learn More →
                </Link>
              </div>
            </ScrollAnimation>
            
            {/* Parkside Melody */}
            <ScrollAnimation delay={0.2} direction="right">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
                  <Image
                    src="/images/melody-bg.jpg"
                    alt="Parkside Melody"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Parkside Melody</h3>
                <p className="text-gray-600 mb-4">
                  Our community-focused chorus that welcomes singers of all experience levels. Parkside Melody performs at local events and focuses on bringing barbershop harmony to the Hershey community.
                </p>
                <Link 
                  href="/choruses/melody"
                  className="text-indigo-600 font-medium hover:text-indigo-500"
                >
                  Learn More →
                </Link>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </PageTransition>
  );
} 