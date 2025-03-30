"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import ChorusHero from "@/components/ui/ChorusHero";
import { useChorus } from "@/contexts/ChorusContext";

// Since we're using client component with "use client", metadata must be in a separate file
// See metadata.ts in the same directory

const PageTransition = dynamic(() => import("@/components/ui/PageTransition"), {
  ssr: true
});

export default function AboutPage() {
  const { selectedChorus } = useChorus();
  
  // Get the appropriate content based on the selected chorus
  const getStoryContent = () => {
    if (selectedChorus === 'harmony') {
      return {
        image: "/images/harmony/about/story.jpg",
        title: "Our Story",
        paragraphs: [
          "Founded in 2009, Parkside Harmony has grown from a small group of passionate singers into one of the premier men's choruses in the mid-atlantic region.",
          "Our journey began with a vision to create a space where singers could pursue musical excellence in the barbershop style while fostering meaningful connections within our community. Today, that vision has blossomed into a thriving organization that continues to push the boundaries of a cappella performance."
        ]
      };
    } else if (selectedChorus === 'melody') {
      return {
        image: "/images/melody/about/story.jpg",
        title: "Our Story",
        paragraphs: [
          "Established as a sister chorus to Parkside Harmony, Parkside Melody has quickly become a vibrant community of treble voices dedicated to musical excellence.",
          "We've created a welcoming space for singers of all experience levels to explore the joy of a cappella harmony. Our chorus celebrates diversity and inclusivity, while focusing on developing musical skills and creating memorable performances."
        ]
      };
    } else {
      return {
        image: "/images/both/about/story.jpg",
        title: "Our Story",
        paragraphs: [
          "Founded in 2015, Parkside has grown from a small group of passionate singers into two vibrant choruses that represent the very best of barbershop harmony in the mid-atlantic region.",
          "Our journey began with a vision to create a space where singers could pursue musical excellence while fostering meaningful connections within our community. Today, that vision has blossomed into a thriving organization that continues to push the boundaries of a cappella performance."
        ]
      };
    }
  };
  
  // Get achievement gallery images
  const getAchievementGallery = () => {
    const prefix = selectedChorus 
      ? `/images/${selectedChorus}/about/achievements/`
      : "/images/both/about/achievements/";
      
    return [
      `${prefix}gallery1.jpg`,
      `${prefix}gallery2.jpg`,
      `${prefix}gallery3.jpg`,
      `${prefix}gallery4.jpg`
    ];
  };
  
  // Get the join text
  const getJoinText = () => {
    if (selectedChorus === 'harmony') {
      return "Join Our Harmony";
    } else if (selectedChorus === 'melody') {
      return "Join Our Melody";
    } else {
      return "Join Our Family";
    }
  };
  
  const storyContent = getStoryContent();
  const achievementGallery = getAchievementGallery();
  const joinText = getJoinText();

  return (
    <PageTransition>
      <ChorusHero
        page="about"
        title="About Parkside"
        description="Celebrating barbershop excellence in Hershey since 2015"
        height="500px"
      />

      {/* Our Story Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollAnimation direction="right">
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={storyContent.image}
                  alt="Parkside Chorus History"
                  fill
                  className="object-cover"
                />
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation direction="left">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">{storyContent.title}</h2>
                <div className="prose prose-lg">
                  {storyContent.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Mission & Values</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our commitment to musical excellence is guided by these core principles
              </p>
            </div>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Excellence",
                description: "Striving for the highest standards in every performance",
                icon: (
                  <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                )
              },
              {
                title: "Community",
                description: "Building lasting friendships through shared passion",
                icon: (
                  <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )
              },
              {
                title: "Education",
                description: "Continuous learning and development for all members",
                icon: (
                  <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )
              },
              {
                title: "Diversity",
                description: "We celebrate the unique perspective each individual brings",
                icon: (
                  <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                )
              }
            ].map((item, index) => (
              <ScrollAnimation key={item.title} delay={index * 0.1}>
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="w-16 h-16 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements & Community Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Achievements</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Celebrating our journey of musical excellence and community impact
              </p>
            </div>
          </ScrollAnimation>

          {/* Photo Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {achievementGallery.map((image, index) => (
              <ScrollAnimation key={image} delay={index * 0.1}>
                <div className="relative h-[200px] rounded-xl overflow-hidden">
                  <Image
                    src={image}
                    alt={`Parkside ${selectedChorus || ''} Achievement ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Inclusion Statement Section */}
      <section className="py-24 bg-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <ScrollAnimation>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-8">Our Commitment to Inclusion</h2>
              <div className="space-y-6 text-lg font-light">
                <p>
                  Parkside does not discriminate based on age, race, physical ability, gender, sexual orientation, religion, education, or socio-economic status. We celebrate the unique perspective each individual brings, and each individual can expect to be supported by the whole community just as they are expected to support others.
                </p>
                <p>
                  We enthusiastically embrace all singers who share the love of our hobby, encourage our members through fellowship, and leave a lasting, positive impact on our audience through our music and performance.
                </p>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">{joinText}</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Be part of something extraordinary. Join us in creating unforgettable musical experiences.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/join" className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-full text-lg font-semibold hover:bg-indigo-700 transition-colors duration-300">
                Join Us
              </Link>
              <Link href="/events" className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-full text-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-colors duration-300">
                See Upcoming Performances
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </PageTransition>
  );
} 