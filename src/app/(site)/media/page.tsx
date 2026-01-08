"use client";

import PageTransition from "@/components/ui/PageTransition";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import HeroSection from "@/components/ui/HeroSection";
import dynamic from "next/dynamic";
import type { YouTubeProps } from "react-youtube";
import { useState, useMemo, useEffect } from "react";
import { useChorus } from "@/lib/chorus-context";
import { usePageBanner } from "@/hooks/usePageBanner";

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

type FilterType = "all" | "harmony" | "melody" | "voices" | "competition";

export default function MediaPage() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const { chorus: selectedChorus } = useChorus();
  // Pre-select filter based on chorus choice: harmony/melody pre-selects that filter, voices shows all
  const getInitialFilter = (chorus: string): FilterType => {
    if (chorus === "harmony") return "harmony";
    if (chorus === "melody") return "melody";
    return "all"; // "voices" shows all by default
  };
  const [filter, setFilter] = useState<FilterType>(() => getInitialFilter(selectedChorus));
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const bannerImage = usePageBanner("media");

  // Update filter when chorus selection changes (e.g., user changes via header)
  useEffect(() => {
    setFilter(getInitialFilter(selectedChorus));
    setVisibleCount(6);
  }, [selectedChorus]);

  // Fetch admin-managed videos
  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch("/api/videos");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
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

  // Filter and sort videos based on user-selected UI filter only
  // (chorus pre-selects the filter but doesn't permanently hide content)
  const filteredVideos = videos
    .filter(video => {
      if (filter === "all") return true;
      if (filter === "competition") return !!video.competition;
      if (filter === "voices") return video.chorus === "voices";
      // For harmony/melody filters, show that chorus plus any "voices" (combined) videos
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

  const hasVideos = videos.length > 0;

  return (
    <PageTransition>
      <div className="bg-white">
        <HeroSection
          title="Media Gallery"
          subtitle={heroVideo ? `Featuring: ${heroVideo.title}` : "Performance Videos"}
          imagePath={bannerImage}
          imageAlt="Parkside Performance"
          videoId={heroVideo?.id}
        />

        {/* Filter Section - only show if there are videos */}
        {hasVideos && (
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
        )}

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
                ) : !hasVideos ? (
                  <div className="text-center py-16">
                    <div className="max-w-md mx-auto">
                      <svg
                        className="w-16 h-16 mx-auto text-gray-400 mb-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No Videos Yet
                      </h3>
                      <p className="text-gray-600">
                        Check back soon for performance videos from Parkside Harmony, Parkside Melody, and Parkside Voices.
                      </p>
                    </div>
                  </div>
                ) : visibleVideos.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">
                      No videos match the current filter. Try selecting a different category.
                    </p>
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
                {hasMore && !loading && hasVideos && (
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
