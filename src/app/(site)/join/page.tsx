"use client";

import { useState, useEffect } from "react";
import PageTransition from "@/components/ui/PageTransition";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import HeroSection from "@/components/ui/HeroSection";
import Link from "next/link";
import Image from "next/image";
import { useChorus } from "@/lib/chorus-context";
import { usePageBanner } from "@/hooks/usePageBanner";
import type { PageContent } from "@/types/admin";

// Fallback content used before the API responds or if it fails
const defaultContent: PageContent = {
  heroTitle_harmony: "Join Parkside Harmony!",
  heroSubtitle_harmony:
    "Join our award-winning a cappella barbershop chorus and experience the thrill of four-part harmony.",
  heroTitle_melody: "Join Parkside Melody!",
  heroSubtitle_melody:
    "Join our vibrant treble-voiced barbershop ensemble and discover the joy of singing in harmony.",
  heroTitle_voices: "Join Parkside!",
  heroSubtitle_voices:
    "We are proud to have both Parkside Harmony (TTBB) and Parkside Melody (SSAA) ensembles as part of our Parkside Chorus Family.",
  auditionTitle: "Audition Process",
  auditionIntro_harmony:
    "To become a performing member of Parkside Harmony, we invite you to go through our audition process:",
  auditionIntro_melody:
    "To become a performing member of Parkside Melody, we invite you to go through our audition process:",
  auditionIntro_voices:
    "To become a performing member of one of our groups, we invite you to go through our audition process:",
  step1Title: "Performance Skills",
  step1Text: "Learn and demonstrate basic performance staging/choreography",
  step2Title: "Quartet Performance",
  step2Text: "Learn and perform your part in a quartet setting",
  step3Title: "Interview",
  step3Text: "Personal interview with Music Leadership",
  voiceType_harmony: "TTBB (Tenor, Lead, Baritone, Bass)",
  rehearsal_harmony: "Tuesdays, 7:00 PM - 9:30 PM",
  voiceType_melody: "SSAA (Soprano, Alto)",
  rehearsal_melody: "Thursdays, 7:00 PM - 9:00 PM",
  ctaTitle: "Ready to Take the Next Step?",
  ctaText_harmony:
    "If you'd like more information on our audition process for Parkside Harmony, contact us:",
  ctaText_melody:
    "If you'd like more information on our audition process for Parkside Melody, contact us:",
  ctaText_voices:
    "If you'd like more information on our audition process for either group, contact us:",
  contactEmail: "audition@parksideharmony.org",
  eventsButtonText: "Check Our Events Calendar",
  eventsButtonSubtext: "Find our next rehearsal and plan your visit",
};

const chorusNames = {
  harmony: "Parkside Harmony",
  melody: "Parkside Melody",
  voices: "Parkside",
};

export default function JoinPage() {
  const { chorus } = useChorus();
  const bannerImage = usePageBanner("join");
  const [pageContent, setPageContent] = useState<PageContent | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/page-content");
        const data = await response.json();
        if (data.success) {
          setPageContent(data.data.join);
        }
      } catch (error) {
        console.error("Error fetching join page content:", error);
      }
    };
    fetchContent();
  }, []);

  // Admin content wins, falling back to the defaults above
  const text = (key: string) => pageContent?.[key] || defaultContent[key] || "";

  const contactEmail = text("contactEmail");
  const voiceType = text(`voiceType_${chorus}`);
  const rehearsal = text(`rehearsal_${chorus}`);

  const steps = [
    { title: text("step1Title"), description: text("step1Text") },
    { title: text("step2Title"), description: text("step2Text") },
    { title: text("step3Title"), description: text("step3Text") },
  ];

  return (
    <PageTransition>
      <div className="bg-white">
        <HeroSection
          title={text(`heroTitle_${chorus}`)}
          subtitle={text(`heroSubtitle_${chorus}`)}
          imagePath={bannerImage}
          imageAlt={`${chorusNames[chorus]} Performance`}
        />

        {/* Audition Process Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  {text("auditionTitle")}
                </h2>
                <p className="text-lg text-gray-600 mb-8 text-center">
                  {text(`auditionIntro_${chorus}`)}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-6 text-center"
                    >
                      <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  ))}
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
                  {text("ctaTitle")}
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  {text(`ctaText_${chorus}`)}
                </p>
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-xl text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                >
                  {contactEmail}
                </a>

                {chorus !== "voices" && (voiceType || rehearsal) && (
                  <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
                    {voiceType && (
                      <p className="text-gray-700">
                        <strong>Voice Parts:</strong> {voiceType}
                      </p>
                    )}
                    {rehearsal && (
                      <p className="text-gray-700">
                        <strong>Rehearsals:</strong> {rehearsal}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-12">
                  <Link
                    href="/events"
                    className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    {text("eventsButtonText")}
                  </Link>
                  <p className="text-gray-600 mt-4">
                    {text("eventsButtonSubtext")}
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
