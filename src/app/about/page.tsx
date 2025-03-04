import { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/ui/PageTransition";
import ScrollAnimation from "@/components/ui/ScrollAnimation";

export const metadata: Metadata = {
  title: "About Parkside Barbershop Harmony",
  description: "Learn about the Hershey Chapter of the Barbershop Harmony Society - our history, mission, and choruses.",
};

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative h-[400px] bg-gray-900">
            <div className="absolute inset-0">
              <Image
                src="/images/hero-bg.jpg"
                alt="About Parkside Barbershop"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/60" />
            </div>
            
            <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                About Parkside
              </h1>
              <p className="text-xl text-white/90 max-w-2xl">
                The Hershey Chapter of the Barbershop Harmony Society, dedicated to preserving and performing a cappella music in the barbershop style.
              </p>
            </div>
          </section>

          {/* About Content */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <ScrollAnimation direction="right">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                    <p className="text-gray-600 mb-4">
                      Parkside was founded in 2010 as the Hershey Chapter of the Barbershop Harmony Society. What started as a small group of dedicated singers has grown into two distinct choruses: Parkside Harmony and Parkside Melody.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Parkside Harmony is our competitive men's chorus that has achieved recognition at district and international competitions. With a focus on musical excellence and performance artistry, Parkside Harmony continues to push the boundaries of the barbershop art form.
                    </p>
                    <p className="text-gray-600">
                      Parkside Melody is our community chorus that welcomes singers of all experience levels. With a focus on community engagement and the joy of singing, Parkside Melody performs at local events and brings barbershop harmony to the Hershey area.
                    </p>
                  </div>
                </ScrollAnimation>
                <ScrollAnimation direction="left" delay={0.2}>
                  <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src="/images/harmony-bg.jpg"
                      alt="Parkside Chorus Performance"
                      fill
                      className="object-cover"
                    />
                  </div>
                </ScrollAnimation>
              </div>
            </div>
          </section>

          {/* Mission and Values */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <ScrollAnimation>
                <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Mission & Values</h2>
              </ScrollAnimation>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ScrollAnimation delay={0.1}>
                  <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                      <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Musical Excellence</h3>
                    <p className="text-gray-600 text-center">
                      We strive for the highest level of musical performance, constantly refining our craft and pushing the boundaries of a cappella singing.
                    </p>
                  </div>
                </ScrollAnimation>
                
                <ScrollAnimation delay={0.2}>
                  <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                      <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Fellowship</h3>
                    <p className="text-gray-600 text-center">
                      We foster a sense of brotherhood and camaraderie among our members, creating lifelong friendships through our shared love of music.
                    </p>
                  </div>
                </ScrollAnimation>
                
                <ScrollAnimation delay={0.3}>
                  <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                      <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Preservation</h3>
                    <p className="text-gray-600 text-center">
                      We are dedicated to preserving and promoting the barbershop style of a cappella singing for future generations to enjoy.
                    </p>
                  </div>
                </ScrollAnimation>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <ScrollAnimation>
                <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Leadership Team</h2>
              </ScrollAnimation>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Team Member 1 */}
                <ScrollAnimation delay={0.1} direction="up">
                  <div className="text-center">
                    <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 text-2xl">JD</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">John Doe</h3>
                    <p className="text-indigo-600 mb-3">Chapter President</p>
                    <p className="text-gray-600 max-w-md mx-auto">
                      John has been with Parkside since its founding and leads our chapter with passion and dedication to the barbershop art form.
                    </p>
                  </div>
                </ScrollAnimation>
                
                {/* Team Member 2 */}
                <ScrollAnimation delay={0.2} direction="up">
                  <div className="text-center">
                    <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 text-2xl">JS</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">James Smith</h3>
                    <p className="text-indigo-600 mb-3">Music Director, Parkside Harmony</p>
                    <p className="text-gray-600 max-w-md mx-auto">
                      James brings 15 years of barbershop experience to his role as Music Director of our competitive chorus, Parkside Harmony.
                    </p>
                  </div>
                </ScrollAnimation>
                
                {/* Team Member 3 */}
                <ScrollAnimation delay={0.3} direction="up">
                  <div className="text-center">
                    <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 text-2xl">EJ</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Emily Johnson</h3>
                    <p className="text-indigo-600 mb-3">Music Director, Parkside Melody</p>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Emily leads our community chorus, Parkside Melody, with enthusiasm and a commitment to making barbershop accessible to all.
                    </p>
                  </div>
                </ScrollAnimation>
              </div>
            </div>
          </section>

          {/* Barbershop Info Section */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <ScrollAnimation>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">About Barbershop Harmony</h2>
              </ScrollAnimation>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <ScrollAnimation delay={0.1}>
                  <div className="relative h-[300px] rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src="/images/melody-bg.jpg"
                      alt="Barbershop Quartet"
                      fill
                      className="object-cover"
                    />
                  </div>
                </ScrollAnimation>
                <ScrollAnimation delay={0.2}>
                  <div>
                    <p className="text-gray-600 mb-4">
                      Barbershop harmony is a style of a cappella singing characterized by consonant four-part chords for every melody note in a predominantly homophonic texture.
                    </p>
                    <p className="text-gray-600 mb-4">
                      The melody is typically sung by the lead, with the tenor harmonizing above the melody, the bass singing the lowest notes, and the baritone completing the chord.
                    </p>
                    <p className="text-gray-600">
                      The Barbershop Harmony Society, founded in 1938, is dedicated to preserving this unique American art form. As the Hershey Chapter, we're proud to continue this tradition through our performances and community outreach.
                    </p>
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