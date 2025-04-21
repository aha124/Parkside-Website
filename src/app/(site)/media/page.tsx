'use client';

import PageTransition from "@/components/ui/PageTransition";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import ChorusHero from "@/components/ui/ChorusHero";
import dynamic from "next/dynamic";
import type { YouTubeProps } from "react-youtube";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useChorus } from "@/contexts/ChorusContext";

// Dynamically import YouTube component to avoid SSR issues
const YouTube = dynamic(() => import("react-youtube"), { ssr: false });

interface VideoData {
  id: string;
  title: string;
  description: string;
  year: number;
  chorus: "harmony" | "melody" | "both";
  competition?: string;
  placement?: string;
  featured?: boolean; // Mark videos that should be featured
}

const videos: VideoData[] = [
  // Harmony Videos - Most Recent First
  {
    id: "tmrUqGZbTm0",
    title: "2023 BHS International - Louisville, KY",
    description: "Silver Medal Performance (93.0) - Parkside Harmony's highest achievement to date at the 84th Annual Convention of the Barbershop Harmony Society",
    year: 2023,
    chorus: "harmony",
    competition: "BHS International",
    placement: "2nd Place",
    featured: true
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
    chorus: "melody",
    featured: true
  },
  {
    id: "zDLIifqs0nU",
    title: "Parkside Melody - Shine",
    description: "Competition Performance",
    year: 2023,
    chorus: "melody",
    featured: true
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
    chorus: "both",
    featured: true
  }
];

type FilterType = "all" | "harmony" | "melody" | "both" | "competition";
/* type FilterOption = { // Removed unused type
  label: string;
  value: FilterType;
  tooltip: string;
}; */

export default function MediaPage() {
  const { selectedChorus } = useChorus();
  const [filter, setFilter] = useState<FilterType>("all");
  const [visibleCount, setVisibleCount] = useState(6);
  const [reloadCounter, setReloadCounter] = useState(0);

  // Filter videos based on selectedChorus context first (memoized)
  const contextFilteredVideos = useMemo(() => {
    if (selectedChorus) {
      console.log(`Filtering videos for selected context: ${selectedChorus}`);
      return videos.filter(v => v.chorus === selectedChorus || v.chorus === 'both');
    } 
    console.log("No chorus context selected, using all videos.");
    return videos;
  }, [selectedChorus]);

  // Memoize the function to get a featured video
  const getFeaturedVideo = useCallback(() => {
    // Filter videos based on the selected chorus context first
    const relevantVideos = contextFilteredVideos;
    
    // Prefer videos explicitly marked as featured within the relevant set
    const featured = relevantVideos.filter(v => v.featured);
    if (featured.length > 0) {
      console.log(`Selecting a featured video from ${featured.length} options (Context: ${selectedChorus || 'all'})`);
      return featured[Math.floor(Math.random() * featured.length)];
    }
    
    // If no featured videos in the context, select a random one from the relevant set
    if (relevantVideos.length > 0) {
      console.log(`No specific featured video found for context ${selectedChorus || 'all'}, selecting random from ${relevantVideos.length} relevant videos.`);
      return relevantVideos[Math.floor(Math.random() * relevantVideos.length)];
    }
    
    // Fallback if absolutely no relevant videos (shouldn't happen with current data)
    console.warn("No relevant videos found, falling back to first video overall.");
    return videos[0]; 
  }, [contextFilteredVideos, selectedChorus]);

  const [heroVideo, setHeroVideo] = useState<VideoData>(() => {
    console.log("Initializing hero video on page load");
    // Call the function directly for initial state - Note: context might not be ready here yet
    // If initial context matters, might need an effect
    return getFeaturedVideo(); 
  });
  
  // Update the hero video when the chorus changes or reload is triggered
  useEffect(() => {
    const newHeroVideo = getFeaturedVideo(); // Now uses memoized function
    console.log(`Selected hero video: "${newHeroVideo.title}" (Chorus: ${newHeroVideo.chorus}) - Selected chorus: ${selectedChorus || 'none'}`);
    setHeroVideo(newHeroVideo);
  // Add getFeaturedVideo to dependencies. It's memoized, so this is safe.
  }, [selectedChorus, reloadCounter, getFeaturedVideo]); 
  
  // Add a function that can be called to force reselection of a video (for manual testing)
  const reloadVideo = useCallback(() => {
    console.log("Manually reloading video selection");
    setReloadCounter(prev => prev + 1);
  }, []);

  // Video options for hero background
  const [heroOpts, setHeroOpts] = useState<YouTubeProps['opts']>({
    height: '100%',
    width: '100%',
    playerVars: {
      modestbranding: 1,
      rel: 0,
      autoplay: 1,
      mute: 1,
      controls: 0,
      showinfo: 0,
      loop: 1,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3, // Hide video annotations
      color: 'white'
    },
  });
  
  // Update playlist parameter when hero video changes
  useEffect(() => {
    setHeroOpts((prev: YouTubeProps['opts']) => ({
      ...prev,
      playerVars: {
        ...(prev.playerVars || {}),
        playlist: heroVideo.id, // Required for looping
      }
    }));
  }, [heroVideo]);
  
  // Video options for featured video section (user-controlled)
  const featuredOpts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      modestbranding: 1,
      rel: 0,
      autoplay: 0, // Don't autoplay
      controls: 1, // Show controls
      showinfo: 1, // Show video info
      fs: 1, // Allow fullscreen
      color: 'red'
    },
  };
  
  // Video options for grid videos
  const gridOpts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      modestbranding: 1,
      rel: 0,
      autoplay: 0,
      controls: 1,
    },
  };

  // Filter and sort videos (uses contextFilteredVideos now)
  const filteredVideos = useMemo(() => {
    console.log(`Applying UI filter: ${filter} to context-filtered videos (count: ${contextFilteredVideos.length})`);
    return contextFilteredVideos
    .filter(video => {
      if (filter === "competition") return !!video.competition;
      if (filter === "both") return video.chorus === "both";
      if (filter === "harmony") return video.chorus === "harmony";
      if (filter === "melody") return video.chorus === "melody";
      // "all" filter is handled by contextFilteredVideos
      return true;
    })
    .sort((a, b) => b.year - a.year);
  }, [filter, contextFilteredVideos]);

  const visibleVideos = filteredVideos.slice(0, visibleCount);
  const hasMore = visibleCount < filteredVideos.length;

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, filteredVideos.length));
  };

  // Reset visible count when filter changes
  const handleFilterChange = (newFilter: FilterType) => {
    console.log(`Changing filter to: ${newFilter}`);
    setFilter(newFilter);
    setVisibleCount(6);
  };

  return (
    <PageTransition>
      <div className="bg-white">
        <ChorusHero
          page="media"
          title={selectedChorus ? `${selectedChorus.charAt(0).toUpperCase() + selectedChorus.slice(1)} Media Gallery` : "Media Gallery"}
          description={`Featuring performances by Parkside${selectedChorus ? ' ' + selectedChorus.charAt(0).toUpperCase() + selectedChorus.slice(1) : ''}`}
          videoId={heroVideo.id} // Pass video ID to use as background
          youtubeOpts={heroOpts} // Pass the hero video options
        />

        {/* Featured Video Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                  {selectedChorus 
                    ? `Featured ${selectedChorus.charAt(0).toUpperCase() + selectedChorus.slice(1)} Performance` 
                    : "Featured Performance"}
                </h2>
                <div className="aspect-video relative rounded-lg overflow-hidden shadow-xl">
                  <YouTube
                    videoId={heroVideo.id}
                    opts={featuredOpts}
                    className="absolute inset-0"
                    iframeClassName="w-full h-full"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {heroVideo.title}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {heroVideo.description}
                  </p>
                  <div className="mt-3 flex flex-col items-center">
                    <div className="flex justify-center mb-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium capitalize" 
                        style={{
                          backgroundColor: heroVideo.chorus === 'harmony' ? '#4F46E5' : 
                                        heroVideo.chorus === 'melody' ? '#EC4899' : '#6366F1',
                          color: 'white'
                        }}
                      >
                        {heroVideo.chorus === 'both' ? 'Combined' : `Parkside ${heroVideo.chorus.charAt(0).toUpperCase()}${heroVideo.chorus.slice(1)}`}
                      </span>
                      {heroVideo.placement && (
                        <span className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          {heroVideo.placement}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={reloadVideo}
                      className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Show Different Video
                    </button>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-4">
              <div className="flex items-center mr-2">
                <span className="text-sm font-medium text-gray-700 mr-2">Current Videos:</span>
                <span className="px-3 py-1 rounded-full text-sm font-medium" 
                  style={{
                    backgroundColor: selectedChorus === 'harmony' ? '#4F46E5' : 
                                  selectedChorus === 'melody' ? '#EC4899' : '#6366F1',
                    color: 'white'
                  }}
                >
                  {selectedChorus === 'harmony' ? 'Harmony Only' : 
                   selectedChorus === 'melody' ? 'Melody Only' : 
                   'All Choruses'}
                </span>
              </div>
              <div className="h-8 w-px bg-gray-300 mx-2"></div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "All Videos", value: "all", tooltip: selectedChorus ? `All ${selectedChorus} videos` : "All videos from both choruses" },
                  ...((!selectedChorus || selectedChorus === "harmony") ? [{ label: "Harmony Only", value: "harmony", tooltip: "Videos featuring only Parkside Harmony" }] : []),
                  ...((!selectedChorus || selectedChorus === "melody") ? [{ label: "Melody Only", value: "melody", tooltip: "Videos featuring only Parkside Melody" }] : []),
                  // Only show Combined button when no chorus is selected
                  ...(!selectedChorus ? [{ label: "Combined Performances", value: "both", tooltip: "Special performances featuring both Harmony and Melody choruses" }] : []),
                  { label: "Competition Videos", value: "competition", tooltip: selectedChorus ? `${selectedChorus.charAt(0).toUpperCase() + selectedChorus.slice(1)} competition performances` : "Competition performances from both choruses" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange(option.value as FilterType)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                      filter === option.value
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                    title={option.tooltip}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Filter Summary Section */}
        <section className="bg-gray-50 py-6">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                {filter === "competition" ? (
                  <div className="flex items-start">
                    <div className="mr-4 bg-indigo-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Competition Performances</h3>
                      <p className="text-gray-600 mt-1">
                        {selectedChorus 
                          ? `Watch Parkside ${selectedChorus.charAt(0).toUpperCase() + selectedChorus.slice(1)}'s competition sets from various barbershop competitions and events.` 
                          : "Watch competition sets from both of our choruses, showcasing our best performances on the barbershop competition stage."}
                      </p>
                    </div>
                  </div>
                ) : filter === "both" ? (
                  <div className="flex items-start">
                    <div className="mr-4 bg-purple-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Combined Performances</h3>
                      <p className="text-gray-600 mt-1">
                        Special collaborations where Parkside Harmony and Parkside Melody perform together, creating unique musical experiences.
                      </p>
                    </div>
                  </div>
                ) : selectedChorus === "harmony" || filter === "harmony" ? (
                  <div className="flex items-start">
                    <div className="mr-4 bg-blue-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Parkside Harmony Performances</h3>
                      <p className="text-gray-600 mt-1">
                        Showcasing our men&apos;s chorus with their award-winning performances and heartfelt barbershop arrangements.
                      </p>
                    </div>
                  </div>
                ) : selectedChorus === "melody" || filter === "melody" ? (
                  <div className="flex items-start">
                    <div className="mr-4 bg-emerald-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Parkside Melody Performances</h3>
                      <p className="text-gray-600 mt-1">
                        Experience our women&apos;s chorus with their beautiful harmonies and engaging performances across various styles.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start">
                    <div className="mr-4 bg-indigo-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">All Parkside Performances</h3>
                      <p className="text-gray-600 mt-1">
                        Browse our complete collection of performances from both Parkside Harmony and Parkside Melody across various years and events.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Video Grid Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <ScrollAnimation>
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  All Performances
                </h2>
                
                {visibleVideos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visibleVideos.map((video) => (
                      <div 
                        key={video.id}
                        className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 duration-300"
                      >
                        <div className="aspect-video relative">
                          <YouTube
                            videoId={video.id}
                            opts={gridOpts}
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
                                  backgroundColor: video.chorus === 'harmony' ? '#2563EB' : 
                                                video.chorus === 'melody' ? '#059669' : '#6366F1',
                                  color: 'white'
                                }}
                              >
                                {video.chorus === 'both' ? 'Combined' : 
                                 video.chorus === 'harmony' ? 'Parkside Harmony' : 
                                 video.chorus === 'melody' ? 'Parkside Melody' : 
                                 video.chorus}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <p className="text-lg text-gray-600">No videos match the selected filter.</p>
                  </div>
                )}

                {/* Show More Button */}
                {hasMore && (
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