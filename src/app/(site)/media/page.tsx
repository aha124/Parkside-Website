'use client';

import PageTransition from "@/components/ui/PageTransition";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import HeroSection from "@/components/ui/HeroSection";
import dynamic from "next/dynamic";
import type { YouTubeProps } from "react-youtube";
import { useState, useMemo, useEffect } from "react";
import { useChorus, shouldShowForChorus } from "@/lib/chorus-context";

// Dynamically import YouTube component to avoid SSR issues
const YouTube = dynamic(() => import("react-youtube"), { ssr: false });

interface VideoData {
  id: string;
  youtubeId?: string; // Admin videos use youtubeId
  title: string;
  description: string;
  year: number;
  chorus: "harmony" | "melody" | "voices";
  competition?: string;
  placement?: string;
}

// Fallback hardcoded videos (used if no admin videos exist)
const fallbackVideos: VideoData[] = [
  // Harmony Videos - Most Recent First
  {
    id: "tmrUqGZbTm0",
    title: "2023 BHS International - Louisville, KY",
    description: "Silver Medal Performance (93.0) - Parkside Harmony's highest achievement to date at the 84th Annual Convention of the Barbershop Harmony Society",
    year: 2023,
    chorus: "harmony",
    competition: "BHS International",
    placement: "2nd Place"
  },
  {
    id: "vyOippZCn-s",
    title: "Parkside Harmony - 2023 Mid-Atlantic District",
    description: "Championship performance at the Mid-Atlantic District Convention",
    year: 2023,
    chorus: "harmony",
    competition: "MAD District",
    placement: "1st Place"
  },
  {
    id: "r04jAi34S0w",
    title: "Parkside Harmony - 2022 BHS International",
    description: "Bronze Medal performance at the 2022 BHS International Contest",
    year: 2022,
    chorus: "harmony",
    competition: "BHS International",
    placement: "3rd Place"
  },
  {
    id: "9HFIWMH_kfw",
    title: "Parkside Harmony - 2022 Mid-Atlantic District",
    description: "Championship performance at the Mid-Atlantic District Convention",
    year: 2022,
    chorus: "harmony",
    competition: "MAD District",
    placement: "1st Place"
  },
  {
    id: "ppVNYMyy8JM",
    title: "Parkside Harmony - You're Nobody Till Somebody Loves You",
    description: "Special performance featuring this classic barbershop arrangement",
    year: 2022,
    chorus: "harmony"
  },
  {
    id: "_B1BJC2inVE",
    title: "Parkside Harmony - 2021 Performance",
    description: "Special performance featuring classic barbershop arrangements",
    year: 2021,
    chorus: "harmony"
  },
  {
    id: "WBNY8UJSfcg",
    title: "Parkside Harmony - 2020 Holiday Show",
    description: "Holiday performance featuring seasonal favorites",
    year: 2020,
    chorus: "harmony"
  },
  {
    id: "pSGGXVfefgA",
    title: "Parkside Harmony - If I Loved You",
    description: "Beautiful rendition of this classic ballad",
    year: 2020,
    chorus: "harmony"
  },
  {
    id: "rznggVEUnd0",
    title: "Parkside Harmony - Sweet Georgia Brown",
    description: "Energetic performance of this barbershop favorite",
    year: 2020,
    chorus: "harmony"
  },
  {
    id: "98nVgsYkBW0",
    title: "Parkside Harmony - Showcase Performance",
    description: "Special showcase featuring multiple arrangements",
    year: 2020,
    chorus: "harmony"
  },
  {
    id: "LjMS3K7UhFw",
    title: "Parkside Harmony - Competition Set",
    description: "Early competition performance showing our growth",
    year: 2019,
    chorus: "harmony",
    competition: "MAD District"
  },
  {
    id: "qdblvDstP1s",
    title: "Parkside Harmony - Holiday Performance",
    description: "Special holiday performance with seasonal favorites",
    year: 2019,
    chorus: "harmony"
  },
  {
    id: "7U9xsLFKUYM",
    title: "Parkside Harmony - Spring Show",
    description: "Spring showcase featuring various arrangements",
    year: 2019,
    chorus: "harmony"
  },
  // Melody Videos - Most Recent First
  {
    id: "cR4x-lDg3Co",
    title: "Parkside Melody - How Can I Keep From Singing",
    description: "Performance at the STAR Center in Havre de Grace, MD",
    year: 2023,
    chorus: "melody"
  },
  {
    id: "zDLIifqs0nU",
    title: "Parkside Melody - Shine",
    description: "Competition Performance",
    year: 2023,
    chorus: "melody"
  },
  {
    id: "2DUhWo6sXLE",
    title: "Parkside Melody - I Will Follow Him",
    description: "Sister Act Medley Performance",
    year: 2023,
    chorus: "melody"
  },
  {
    id: "ligvLfjbcCg",
    title: "Parkside Melody - Seasons of Love",
    description: "From the musical RENT",
    year: 2023,
    chorus: "melody"
  },
  {
    id: "OXfm7suHUSU",
    title: "Parkside Melody - The Prayer",
    description: "Special Performance",
    year: 2022,
    chorus: "melody"
  },
  {
    id: "5qaFszF65Yk",
    title: "Parkside Melody - Defying Gravity",
    description: "From the musical Wicked",
    year: 2022,
    chorus: "melody"
  },
  {
    id: "MasnYtJgq1o",
    title: "Parkside Melody - This Is Me",
    description: "From The Greatest Showman",
    year: 2022,
    chorus: "melody"
  },
  {
    id: "RYZDu_SNcpw",
    title: "Parkside Melody - You Will Be Found",
    description: "From Dear Evan Hansen",
    year: 2022,
    chorus: "melody"
  },
  {
    id: "94Honwb8Eqc",
    title: "Parkside Melody - The Rose",
    description: "Competition Performance",
    year: 2022,
    chorus: "melody"
  },
  {
    id: "gbn7xAvdacM",
    title: "Parkside Melody - For Good",
    description: "From the musical Wicked",
    year: 2022,
    chorus: "melody"
  },
  {
    id: "QNeKN6ciuPw",
    title: "Parkside Melody - Bridge Over Troubled Water",
    description: "Simon & Garfunkel Classic",
    year: 2022,
    chorus: "melody"
  },
  // Combined Virtual Performance
  {
    id: "Bqq699JuNxo",
    title: "Parkside Virtual Performance - The Way We Were",
    description: "Special virtual collaboration between Parkside Harmony and Parkside Melody during the pandemic",
    year: 2020,
    chorus: "voices"
  }
];

type FilterType = "all" | "harmony" | "melody" | "voices" | "competition";

export default function MediaPage() {
  const [videos, setVideos] = useState<VideoData[]>(fallbackVideos);
  const [filter, setFilter] = useState<FilterType>("all");
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const { chorus: selectedChorus } = useChorus();

  // Fetch admin-managed videos
  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch("/api/videos");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.length > 0) {
            // Map admin videos to the expected format
            const adminVideos = data.data.map((v: { id: string; youtubeId: string; title: string; description: string; year: number; chorus: "harmony" | "melody" | "voices" | "both"; competition?: string; placement?: string }) => ({
              ...v,
              id: v.youtubeId, // Use youtubeId as the display id
              // Normalize "both" to "voices" for consistency
              chorus: v.chorus === "both" ? "voices" : v.chorus,
            }));
            setVideos(adminVideos);
          }
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        // Keep fallback videos on error
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  // Randomly select a featured video for the hero background
  const heroVideo = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * videos.length);
    return videos[randomIndex];
  }, [videos]);

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      modestbranding: 1,
      rel: 0,
    },
  };

  // Filter and sort videos - first by global chorus context, then by UI filter
  const filteredVideos = videos
    .filter(video => shouldShowForChorus(video.chorus, selectedChorus))
    .filter(video => {
      if (filter === "all") return true;
      if (filter === "competition") return !!video.competition;
      if (filter === "voices") return video.chorus === "voices";
      return video.chorus === filter || video.chorus === "voices";
    })
    .sort((a, b) => b.year - a.year);

  const visibleVideos = filteredVideos.slice(0, visibleCount);
  const hasMore = visibleCount < filteredVideos.length;

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, filteredVideos.length));
  };

  // Reset visible count when filter changes
  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setVisibleCount(6);
  };

  return (
    <PageTransition>
      <div className="bg-white">
        <HeroSection
          title="Media Gallery"
          subtitle={heroVideo ? `Featuring: ${heroVideo.title}` : "Performance Videos"}
          imagePath="/images/media-hero.jpg"
          imageAlt="Parkside Performance"
          videoId={heroVideo?.id}
        />

        {/* Filter Section */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { label: "All Performances", value: "all" },
                { label: "Parkside Harmony", value: "harmony" },
                { label: "Parkside Melody", value: "melody" },
                { label: "Combined", value: "voices" },
                { label: "Competition Sets", value: "competition" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange(option.value as FilterType)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === option.value
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Video Grid Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  Featured Performances
                </h2>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visibleVideos.map((video) => (
                      <div
                        key={video.id}
                        className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 duration-300"
                      >
                        <div className="aspect-video relative">
                          <YouTube
                            videoId={video.id}
                            opts={opts}
                            className="absolute inset-0"
                            iframeClassName="w-full h-full"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {video.title}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {video.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              {video.year}
                            </span>
                            <div className="flex gap-2">
                              {video.placement && (
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                  {video.placement}
                                </span>
                              )}
                              <span className="px-3 py-1 rounded-full text-sm font-medium capitalize"
                                style={{
                                  backgroundColor: video.chorus === 'harmony' ? '#6366F1' :
                                                video.chorus === 'melody' ? '#F59E0B' : '#8B5CF6',
                                  color: 'white'
                                }}
                              >
                                {video.chorus === 'voices' ? 'Combined' : video.chorus}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Show More Button */}
                {hasMore && !loading && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={handleShowMore}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Show More Videos
                    </button>
                  </div>
                )}
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Additional Media Section - Photos or Other Content */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  More Content Coming Soon
                </h2>
                <p className="text-lg text-gray-600">
                  Stay tuned for more photos, videos, and media content from our performances and events.
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
