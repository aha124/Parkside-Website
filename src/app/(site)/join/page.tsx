import PageTransition from "@/components/ui/PageTransition";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import HeroSection from "@/components/ui/HeroSection";
import Link from "next/link";
import Image from "next/image";

export default function JoinPage() {
  return (
    <PageTransition>
      <div className="bg-white">
        <HeroSection
          title="Join Parkside!"
          subtitle="We are proud to have both Parkside Harmony (TTBB) and Parkside Melody (SSAA) ensembles as part of our Parkside Chorus Family."
          imagePath="/images/join-hero.jpg"
          imageAlt="Parkside Chorus Performance"
        />

        {/* Audition Process Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  Audition Process
                </h2>
                <p className="text-lg text-gray-600 mb-8 text-center">
                  To become a performing member of one of our groups, we invite you to go through our audition process:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {/* Step 1 */}
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                      1
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Skills</h3>
                    <p className="text-gray-600">
                      Learn and demonstrate basic performance staging/choreography
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                      2
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Quartet Performance</h3>
                    <p className="text-gray-600">
                      Learn and perform your part in a quartet setting
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                      3
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Interview</h3>
                    <p className="text-gray-600">
                      Personal interview with Music Leadership
                    </p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Ready to Take the Next Step?
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  If you'd like more information on our audition process for either group, contact us:
                </p>
                <a
                  href="mailto:audition@parksideharmony.org"
                  className="text-xl text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                >
                  audition@parksideharmony.org
                </a>
                <div className="mt-12">
                  <Link
                    href="/events"
                    className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Check Our Events Calendar
                  </Link>
                  <p className="text-gray-600 mt-4">
                    Find our next rehearsal and plan your visit
                  </p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Image Suggestions Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Harmony Image */}
              <div className="relative h-64 rounded-lg overflow-hidden group">
                <Image
                  src="/images/harmony-performance.jpg"
                  alt="Parkside Harmony Performance"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              {/* Melody Image */}
              <div className="relative h-64 rounded-lg overflow-hidden group">
                <Image
                  src="/images/melody-performance.jpg"
                  alt="Parkside Melody Performance"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
} 