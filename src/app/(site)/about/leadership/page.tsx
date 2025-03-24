'use client';

import PageTransition from "@/components/ui/PageTransition";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import LeadershipProfile from "@/components/leadership/LeadershipProfile";

const musicLeadership = [
  {
    name: "Sean Devine",
    title: "Director",
    bio: "Sean brings over 20 years of barbershop experience to Parkside Harmony. As a champion quartet singer and experienced director, he leads our chorus with passion and expertise. Under his direction, we continue to push the boundaries of musical excellence and artistic expression.",
    photoUrl: "/images/leadership/sean-devine.jpg"
  },
  {
    name: "Assistant Director Name",
    title: "Assistant Director",
    bio: "Our Assistant Director brings valuable experience and dedication to the chorus, supporting our musical growth and helping to maintain our high standards of performance.",
    photoUrl: "/images/leadership/assistant-director.jpg"
  },
  {
    name: "Music Team Lead Name",
    title: "Music Team Lead",
    bio: "As Music Team Lead, they coordinate our musical journey and ensure that every voice part receives the support and guidance needed to excel.",
    photoUrl: "/images/leadership/music-lead.jpg"
  }
];

const boardMembers = [
  {
    name: "President Name",
    title: "President",
    bio: "Leading our organization with vision and dedication, ensuring we stay true to our mission while growing and evolving.",
    photoUrl: "/images/leadership/president.jpg"
  },
  {
    name: "Vice President Name",
    title: "Vice President",
    bio: "Supporting our president and bringing fresh perspectives to our organizational leadership.",
    photoUrl: "/images/leadership/vice-president.jpg"
  },
  {
    name: "Secretary Name",
    title: "Secretary",
    bio: "Keeping our organization running smoothly with meticulous attention to detail and excellent communication.",
    photoUrl: "/images/leadership/secretary.jpg"
  },
  {
    name: "Treasurer Name",
    title: "Treasurer",
    bio: "Managing our financial health and ensuring we have the resources needed to achieve our goals.",
    photoUrl: "/images/leadership/treasurer.jpg"
  }
];

const additionalBoardMembers = [
  {
    name: "Board Member 1",
    title: "Board Member",
    bio: "Contributing valuable insights and experience to guide our organization's growth and success.",
    photoUrl: "/images/leadership/board-member-1.jpg"
  },
  {
    name: "Board Member 2",
    title: "Board Member",
    bio: "Helping shape our future through dedicated service and strategic thinking.",
    photoUrl: "/images/leadership/board-member-2.jpg"
  },
  {
    name: "Board Member 3",
    title: "Board Member",
    bio: "Supporting our mission through active participation and community engagement.",
    photoUrl: "/images/leadership/board-member-3.jpg"
  }
];

export default function LeadershipPage() {
  return (
    <PageTransition>
      <div className="bg-white">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white" aria-labelledby="leadership-title">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <h1 id="leadership-title" className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-6">
                Our Leadership Team
              </h1>
              <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
                Meet the passionate individuals who guide and inspire Parkside
                towards musical excellence and organizational success.
              </p>
            </ScrollAnimation>
          </div>
        </section>

        {/* Music Leadership Section */}
        <section className="py-16" aria-labelledby="music-leadership-title">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <h2 id="music-leadership-title" className="text-3xl font-bold text-gray-900 text-center mb-12">
                Music Leadership
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {musicLeadership.map((leader) => (
                  <LeadershipProfile
                    key={leader.name}
                    {...leader}
                    size="large"
                  />
                ))}
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Board of Directors Section */}
        <section className="py-16 bg-gray-50" aria-labelledby="board-directors-title">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <h2 id="board-directors-title" className="text-3xl font-bold text-gray-900 text-center mb-12">
                Board of Directors
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {boardMembers.map((member) => (
                  <LeadershipProfile
                    key={member.name}
                    {...member}
                    size="medium"
                  />
                ))}
              </div>

              {/* Additional Board Members */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {additionalBoardMembers.map((member) => (
                  <LeadershipProfile
                    key={member.name}
                    {...member}
                    size="small"
                  />
                ))}
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Get Involved Section */}
        <section className="py-16" aria-labelledby="get-involved-title">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="text-center">
                <h2 id="get-involved-title" className="text-3xl font-bold text-gray-900 mb-6">
                  Want to Get Involved?
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                  We're always looking for passionate individuals to join our chorus and
                  contribute to our mission of musical excellence.
                </p>
                <a
                  href="/join"
                  className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
                  role="button"
                >
                  Join Our Chorus
                </a>
              </div>
            </ScrollAnimation>
          </div>
        </section>
      </div>
    </PageTransition>
  );
} 