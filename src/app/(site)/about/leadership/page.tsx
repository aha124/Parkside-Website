'use client';

import { useEffect, useState } from "react";
import PageTransition from "@/components/ui/PageTransition";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import HeroSection from "@/components/ui/HeroSection";
import LeadershipProfile from "@/components/leadership/LeadershipProfile";
import { usePageBanner } from "@/hooks/usePageBanner";

type ChorusAffiliation = 'harmony' | 'melody' | 'both';

interface LeadershipMember {
  id: string;
  name: string;
  title: string;
  bio?: string;
  photoUrl?: string;
  chorusAffiliation?: ChorusAffiliation;
}

interface LeadershipGroups {
  musicLeadership: LeadershipMember[];
  boardMembers: LeadershipMember[];
  boardAtLarge: LeadershipMember[];
}

const EMPTY_GROUPS: LeadershipGroups = {
  musicLeadership: [],
  boardMembers: [],
  boardAtLarge: [],
};

/**
 * Public leadership page.
 *
 * Reads the same records the admin edits, via /api/leadership. This page used
 * to hold its own hardcoded copy of every member, so anything changed in the
 * admin was saved correctly and then never appeared here — the roster on the
 * site drifted away from the roster in the admin with nothing to signal it.
 * Don't reintroduce a local copy: an out-of-date list looks convincing.
 */
export default function LeadershipPage() {
  const bannerImage = usePageBanner("leadership");
  const [groups, setGroups] = useState<LeadershipGroups>(EMPTY_GROUPS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/leadership");
        if (!response.ok) throw new Error(`Failed to load leadership: ${response.status}`);
        const { data } = (await response.json()) as { data?: Partial<LeadershipGroups> };
        if (!cancelled && data) setGroups({ ...EMPTY_GROUPS, ...data });
      } catch (error) {
        console.error("Error loading leadership:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const renderMembers = (members: LeadershipMember[]) =>
    members.map((member) => (
      <LeadershipProfile
        key={member.id || member.name}
        name={member.name}
        title={member.title}
        bio={member.bio}
        photoUrl={member.photoUrl}
        chorusAffiliation={member.chorusAffiliation}
      />
    ));

  const skeleton = (count: number) =>
    Array.from({ length: count }).map((_, index) => (
      <div key={index} className="text-center animate-pulse">
        <div className="w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56 rounded-full bg-gray-200 mx-auto mb-4" />
        <div className="h-5 bg-gray-200 rounded w-32 mx-auto mb-2" />
        <div className="h-4 bg-gray-200 rounded w-24 mx-auto" />
      </div>
    ));

  const isEmpty =
    !loading &&
    groups.musicLeadership.length === 0 &&
    groups.boardMembers.length === 0 &&
    groups.boardAtLarge.length === 0;

  return (
    <PageTransition>
      <div className="bg-white">
        <HeroSection
          title="Our Leadership"
          subtitle="Meet the dedicated team guiding Parkside's musical excellence and organizational success."
          imagePath={bannerImage}
          imageAlt="Parkside Leadership Team"
        />

        {/* Music Leadership Section */}
        {(loading || groups.musicLeadership.length > 0) && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <ScrollAnimation>
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  Music Leadership
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                  {loading ? skeleton(4) : renderMembers(groups.musicLeadership)}
                </div>
              </ScrollAnimation>
            </div>
          </section>
        )}

        {/* Board Members Section */}
        {(loading || groups.boardMembers.length > 0 || groups.boardAtLarge.length > 0) && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <ScrollAnimation>
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  Board Members
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
                  {loading ? skeleton(3) : renderMembers(groups.boardMembers)}
                </div>

                {(loading || groups.boardAtLarge.length > 0) && (
                  <>
                    <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                      Board Members at Large
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                      {loading ? skeleton(4) : renderMembers(groups.boardAtLarge)}
                    </div>
                  </>
                )}
              </ScrollAnimation>
            </div>
          </section>
        )}

        {isEmpty && (
          <section className="py-16">
            <div className="container mx-auto px-4 text-center">
              <p className="text-gray-600">
                Leadership information is unavailable right now. Please check back shortly.
              </p>
            </div>
          </section>
        )}

        {/* Get Involved Section */}
        <section className="py-16" aria-labelledby="get-involved-title">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="text-center">
                <h2 id="get-involved-title" className="text-3xl font-bold text-gray-900 mb-6">
                  Want to Get Involved?
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                  We&apos;re always looking for passionate individuals to join our chorus and
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
