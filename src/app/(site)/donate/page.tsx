"use client";

import PageTransition from "@/components/ui/PageTransition";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import HeroSection from "@/components/ui/HeroSection";
import ProgressionSlideshow from "@/components/ui/ProgressionSlideshow";
import Link from "next/link";
import { usePageBanner } from "@/hooks/usePageBanner";

export default function DonatePage() {
  // Uses shared banner - same for all choruses
  const bannerImage = usePageBanner("donate");

  return (
    <PageTransition>
      <div className="bg-white">
        <HeroSection
          title="Parkside Progression"
          subtitle="A Patron Program"
          imagePath={bannerImage}
          imageAlt="Parkside Performance"
        />

        {/* Introduction Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Join Our Parkside Family
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  We invite you to be part of this platform, to help us invest
                  in the barbershop community so together we can continue to
                  bring harmony to those around us.
                </p>
                <Link
                  href="https://givebutter.com/ParksideProgression"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Donate Now
                  <svg
                    className="ml-2 -mr-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Community Slideshow */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                  Parkside in the Community
                </h2>
                <ProgressionSlideshow />
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Progression Definitions Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Musical Harmony */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Musical Harmony
                  </h3>
                  <p className="text-gray-600">
                    <em className="font-semibold block mb-3">
                      Progression: The movement of musical parts in harmony.
                    </em>
                    We encourage you to be part of this platform, to help us
                    invest in the barbershop community so together we can
                    continue to bring harmony to those around us.
                  </p>
                </div>

                {/* Growth */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Growth
                  </h3>
                  <p className="text-gray-600">
                    <em className="font-semibold block mb-3">
                      Progression: The act of changing to the next stage of
                      development.
                    </em>
                    Since the very beginning, Parkside has enjoyed incredible
                    support and encouragement from those who we lovingly call
                    our Parkside Family. We are growing with you and because of
                    you.
                  </p>
                </div>

                {/* Foundation */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Foundation
                  </h3>
                  <p className="text-gray-600">
                    <em className="font-semibold block mb-3">
                      Progression: In a musical composition, a chord progression
                      is the foundation of harmony.
                    </em>
                    Our family of supporters has made it possible for us to do
                    amazing things in our first few years together, helping us
                    to realize our dream of creating a better world in harmony.
                  </p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Make a Difference Through Music
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  We invite you to find out more about our programs, how to
                  become more involved, and to give a gift that is meaningful to
                  you. Please know that we are grateful for every gift; every
                  gift makes a difference.
                </p>
                <div className="space-y-4">
                  <a
                    href="mailto:Progression@ParksideHarmony.org"
                    className="inline-block text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                  >
                    Contact us at Progression@ParksideHarmony.org
                  </a>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Tax Information */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-sm text-gray-500">
              <p>
                The Hershey, PA Chapter of the Barbershop Harmony Society is a
                Section 501(c)(3) nonprofit organization, qualifying your gift
                as a charitable deduction for federal income tax purposes.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
