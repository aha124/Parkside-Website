"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import HeroSection from "@/components/ui/HeroSection";
import PageTransition from "@/components/ui/PageTransition";
import { useChorus } from "@/lib/chorus-context";
import { usePageBanner } from "@/hooks/usePageBanner";
import type { PageContent, SiteSettings } from "@/types/admin";

// Default content for fallback
const defaultChorusContent = {
  harmony: {
    name: "Parkside Harmony",
    tagline: "Celebrating barbershop excellence in Hershey since 2015",
    story: "Parkside Harmony has grown from a small group of passionate singers into one of the premier barbershop choruses in the Mid-Atlantic region.\n\nSince our founding in 2015, we have achieved multiple district championships and international recognition, including a Silver Medal at the 2023 BHS International Competition in Louisville, Kentucky.",
    joinTitle: "Join our Harmony",
    joinCTA: "Experience the thrill of barbershop at its finest.",
  },
  melody: {
    name: "Parkside Melody",
    tagline: "Celebrating barbershop harmony since 2018",
    story: "Parkside Melody was born from a shared love of harmony singing and a desire to create a welcoming space for singers to experience the joy of barbershop.\n\nFounded in 2018, we have quickly grown into a dynamic chorus that combines competitive excellence with community outreach and musical education.",
    joinTitle: "Join our Melody",
    joinCTA: "Discover the power of voices in harmony.",
  },
  voices: {
    name: "Parkside",
    tagline: "Celebrating barbershop excellence in Hershey since 2015",
    story: "Founded in 2015, Parkside has grown from a small group of passionate singers into two vibrant choruses that represent the very best of barbershop harmony in the mid-atlantic region.\n\nOur journey began with a vision to create a space where singers could pursue musical excellence while fostering meaningful connections within our community. Today, that vision has blossomed into a thriving organization that continues to push the boundaries of a cappella performance.",
    joinTitle: "Join our Voices",
    joinCTA: "Be part of something extraordinary.",
  },
};

export default function AboutPage() {
  const { chorus } = useChorus();
  const bannerImage = usePageBanner("about");
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [contentRes, settingsRes] = await Promise.all([
          fetch("/api/admin/page-content?page=about"),
          fetch("/api/admin/site-settings"),
        ]);

        const contentData = await contentRes.json();
        const settingsData = await settingsRes.json();

        if (contentData.success) {
          setPageContent(contentData.data);
        }
        if (settingsData.success) {
          setSiteSettings(settingsData.data);
        }
      } catch (error) {
        console.error("Error fetching about page content:", error);
      }
    };
    fetchContent();
  }, []);

  const defaultContent = defaultChorusContent[chorus];

  // Get story content from API or fallback to defaults
  const storyText = pageContent?.[`story_${chorus}`] || defaultContent.story;
  const storyImage = siteSettings?.aboutStoryImages?.[chorus] || "/images/placeholder-story.jpg";

  return (
    <PageTransition>
      <HeroSection
        title={`ABOUT ${defaultContent.name.toUpperCase()}`}
        subtitle={defaultContent.tagline}
        imagePath={bannerImage}
        imageAlt={`${defaultContent.name} in Performance`}
      />

      {/* Our Story Section */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <ScrollAnimation direction="right">
              <div className="relative h-[250px] sm:h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={storyImage}
                  alt={`${defaultContent.name} History`}
                  fill
                  className="object-cover"
                />
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="left">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
                  Our Story
                </h2>
                <div className="prose prose-sm sm:prose-base md:prose-lg">
                  {storyText.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-12 sm:py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                Mission & Values
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Our commitment to musical excellence is guided by these core
                principles
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                title: "Excellence",
                description:
                  "Striving for the highest standards in every performance",
                icon: (
                  <svg
                    className="w-8 h-8 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                ),
              },
              {
                title: "Community",
                description:
                  "Building lasting friendships through shared passion",
                icon: (
                  <svg
                    className="w-8 h-8 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ),
              },
              {
                title: "Education",
                description:
                  "Continuous learning and development for all members",
                icon: (
                  <svg
                    className="w-8 h-8 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                ),
              },
              {
                title: "Diversity",
                description:
                  "We celebrate the unique perspective each individual brings",
                icon: (
                  <svg
                    className="w-8 h-8 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <ScrollAnimation key={item.title} delay={index * 0.1}>
                <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-indigo-50 rounded-lg md:rounded-xl flex items-center justify-center mb-4 md:mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">{item.description}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements & Community Section */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                Our Achievements
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Celebrating our journey of musical excellence and community
                impact
              </p>
            </div>
          </ScrollAnimation>

          {/* Photo Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-8 sm:mt-12 md:mt-16">
            <ScrollAnimation delay={0.1}>
              <div className="relative h-[120px] sm:h-[150px] md:h-[200px] rounded-lg md:rounded-xl overflow-hidden">
                <Image
                  src="/images/placeholder-gallery-1.jpg"
                  alt="Parkside Performance Moment"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </ScrollAnimation>
            <ScrollAnimation delay={0.2}>
              <div className="relative h-[120px] sm:h-[150px] md:h-[200px] rounded-lg md:rounded-xl overflow-hidden">
                <Image
                  src="/images/placeholder-gallery-2.jpg"
                  alt="Parkside Behind the Scenes"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </ScrollAnimation>
            <ScrollAnimation delay={0.3}>
              <div className="relative h-[120px] sm:h-[150px] md:h-[200px] rounded-lg md:rounded-xl overflow-hidden">
                <Image
                  src="/images/placeholder-gallery-3.jpg"
                  alt="Parkside Celebration"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </ScrollAnimation>
            <ScrollAnimation delay={0.4}>
              <div className="relative h-[120px] sm:h-[150px] md:h-[200px] rounded-lg md:rounded-xl overflow-hidden">
                <Image
                  src="/images/placeholder-gallery-4.jpg"
                  alt="Parkside Community Event"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Inclusion Statement Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">
                Our Commitment to Inclusion
              </h2>
              <div className="space-y-4 sm:space-y-6 text-sm sm:text-base md:text-lg font-light">
                <p>
                  Parkside does not discriminate based on age, race, physical
                  ability, gender, sexual orientation, religion, education, or
                  socio-economic status. We celebrate the unique perspective
                  each individual brings, and each individual can expect to be
                  supported by the whole community just as they are expected to
                  support others.
                </p>
                <p>
                  We enthusiastically embrace all singers who share the love of
                  our hobby, encourage our members through fellowship, and leave
                  a lasting, positive impact on our audience through our music
                  and performance.
                </p>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">
              {defaultContent.joinTitle}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 md:mb-12 max-w-2xl mx-auto">
              {defaultContent.joinCTA} Join us in creating unforgettable musical
              experiences.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
              <Link
                href="/join"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 text-white rounded-full text-base sm:text-lg font-semibold hover:bg-indigo-700 transition-colors duration-300"
              >
                Join Us
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-indigo-600 rounded-full text-base sm:text-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-colors duration-300"
              >
                See Upcoming Performances
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </PageTransition>
  );
}
