import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/ui/PageTransition";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import EventsList from "@/components/events/EventsList";

export const metadata: Metadata = {
  title: "Parkside - Hershey Chapter of the Barbershop Harmony Society",
  description: "Welcome to Parkside - home of Parkside Harmony and Parkside Melody a cappella choruses.",
};

export default function HomePage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
          {/* Hero Section with Carousel */}
          <section className="relative h-[500px] bg-gray-900">
            <div className="absolute inset-0">
              <Image
                src="/images/hero-bg.jpg"
                alt="Parkside Barbershop Harmony"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
            
            <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                Parkside Barbershop Harmony
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mb-8">
                The Hershey Chapter of the Barbershop Harmony Society, featuring Parkside Harmony and Parkside Melody a cappella choruses.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/about"
                  className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Learn More
                </Link>
                <Link 
                  href="/contact"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Join Us
                </Link>
              </div>
            </div>
          </section>

          {/* Events Section */}
          <EventsList 
            title="Upcoming Events" 
            maxEvents={4} 
            dataSource="json" 
            jsonUrl="/data/events.json" 
            showViewAllButton={true}
            viewAllUrl="/events"
          />

          {/* Recent News Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <ScrollAnimation>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Chorus News</h2>
              </ScrollAnimation>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* News Item 1 */}
                <ScrollAnimation direction="right" delay={0.1}>
                  <article className="flex flex-col md:flex-row gap-6">
                    <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                      <Image
                        src="/images/news1.jpg"
                        alt="New Music Director"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="md:w-2/3">
                      <div className="text-sm font-medium text-gray-500 mb-1">February 28, 2025</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Parkside Harmony Welcomes New Music Director</h3>
                      <p className="text-gray-600 mb-4">We're excited to announce our new Music Director who brings 20 years of barbershop experience to our chorus.</p>
                      <Link 
                        href="/news/new-director"
                        className="text-indigo-600 font-medium hover:text-indigo-500"
                      >
                        Read More →
                      </Link>
                    </div>
                  </article>
                </ScrollAnimation>
                
                {/* News Item 2 */}
                <ScrollAnimation direction="right" delay={0.2}>
                  <article className="flex flex-col md:flex-row gap-6">
                    <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                      <Image
                        src="/images/news2.jpg"
                        alt="Competition Award"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="md:w-2/3">
                      <div className="text-sm font-medium text-gray-500 mb-1">February 15, 2025</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Parkside Wins Excellence in Harmony Award</h3>
                      <p className="text-gray-600 mb-4">Our chorus has been recognized for outstanding musical performance at the regional barbershop competition.</p>
                      <Link 
                        href="/news/excellence-award"
                        className="text-indigo-600 font-medium hover:text-indigo-500"
                      >
                        Read More →
                      </Link>
                    </div>
                  </article>
                </ScrollAnimation>
              </div>
            </div>
          </section>

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
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
} 