"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import type { PageContent, SiteSettings, ChorusKey } from "@/types/admin";

const chorusData: Array<{
  key: ChorusKey;
  name: string;
  defaultDescription: string;
  defaultImage: string;
  link: string;
  linkParams: string;
  color: string;
  hoverColor: string;
}> = [
  {
    key: "harmony",
    name: "Parkside Harmony",
    defaultDescription:
      "Our competitive a cappella chorus that performs traditional and contemporary music in the barbershop style. Founded in 2010, Parkside Harmony has competed at the district and international levels.",
    defaultImage: "/images/harmony-bg.jpg",
    link: "/about",
    linkParams: "?chorus=harmony",
    color: "text-indigo-600",
    hoverColor: "hover:text-indigo-500",
  },
  {
    key: "melody",
    name: "Parkside Melody",
    defaultDescription:
      "Our community-focused treble-voiced ensemble that welcomes singers of all experience levels. Parkside Melody performs at local events and focuses on bringing barbershop harmony to the Hershey community.",
    defaultImage: "/images/melody-bg.jpg",
    link: "/about",
    linkParams: "?chorus=melody",
    color: "text-amber-600",
    hoverColor: "hover:text-amber-500",
  },
  {
    key: "voices",
    name: "All Voices",
    defaultDescription:
      "Experience the full Parkside sound with both choruses united in harmony. Our combined performances showcase the best of both ensembles creating a truly unique musical experience.",
    defaultImage: "/images/voices-bg.jpg",
    link: "/about",
    linkParams: "?chorus=voices",
    color: "text-purple-600",
    hoverColor: "hover:text-purple-500",
  },
];

export default function ChorusesSection() {
  const [content, setContent] = useState<PageContent>({});
  const [cardImages, setCardImages] = useState<SiteSettings["chorusCardImages"]>({});

  useEffect(() => {
    // Fetch page content and site settings in parallel
    Promise.all([
      fetch("/api/admin/page-content").then((res) => res.json()),
      fetch("/api/admin/site-settings").then((res) => res.json()),
    ])
      .then(([contentData, settingsData]) => {
        if (contentData.success && contentData.data?.home) {
          setContent(contentData.data.home);
        }
        if (settingsData.success && settingsData.data?.chorusCardImages) {
          setCardImages(settingsData.data.chorusCardImages);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Our Choruses
          </h2>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {chorusData.map((chorus, index) => (
            <ScrollAnimation
              key={chorus.key}
              delay={0.1 * (index + 1)}
              direction={index === 0 ? "left" : index === 2 ? "right" : "up"}
            >
              <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={cardImages?.[chorus.key] || chorus.defaultImage}
                    alt={chorus.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {chorus.name}
                </h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  {content[`chorusCard_${chorus.key}`] || chorus.defaultDescription}
                </p>
                <Link
                  href={`${chorus.link}${chorus.linkParams}`}
                  className={`${chorus.color} font-medium ${chorus.hoverColor}`}
                >
                  Learn More →
                </Link>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
