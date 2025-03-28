"use client";

import Image from "next/image";
import { useChorus } from "@/contexts/ChorusContext";
import chorusContent from "@/data/chorusContent";
import useChorusStyles from "@/hooks/useChorusStyles";
import dynamic from "next/dynamic";
import type { YouTubeProps } from "react-youtube";

// Dynamically import YouTube component to avoid SSR issues
const YouTube = dynamic(() => import("react-youtube"), { ssr: false });

interface ChorusHeroProps {
  page: 'home' | 'about' | 'events' | 'media' | 'join' | 'contact' | 'leadership';
  title: string;
  description?: string;
  height?: string;
  videoId?: string; // Optional video ID for video backgrounds
}

export default function ChorusHero({ page, title, description, height = "300px", videoId }: ChorusHeroProps) {
  const { selectedChorus } = useChorus();
  const { primaryColor } = useChorusStyles();

  // Video options for YouTube
  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      loop: 1,
      controls: 0,
      showinfo: 0,
      mute: 1,
      modestbranding: 1,
      playsinline: 1,
      rel: 0,
      start: 10, // Start a bit into the video to avoid any intro
    },
  };

  // Get the appropriate banner image based on the selected chorus and page
  const getBannerImage = () => {
    if (selectedChorus === 'harmony') {
      return chorusContent.harmony.bannerImages[page];
    } else if (selectedChorus === 'melody') {
      return chorusContent.melody.bannerImages[page];
    } else {
      // Default to a "both" image or fallback to common one
      return page === 'join' 
        ? '/images/join-hero.jpg' 
        : page === 'leadership' 
          ? '/images/leadership-hero.jpg'
          : `/images/placeholder-hero.jpg`;
    }
  };

  // Get the appropriate title based on the selected chorus
  const getTitle = () => {
    if (selectedChorus) {
      return title.replace('Parkside', `Parkside ${selectedChorus.charAt(0).toUpperCase() + selectedChorus.slice(1)}`);
    }
    return title;
  };

  return (
    <section className="relative" style={{ height }}>
      <div className="absolute inset-0 overflow-hidden">
        {videoId ? (
          // Video background for pages that have a videoId
          <div className="absolute inset-0 w-full h-full">
            <YouTube
              videoId={videoId}
              opts={opts}
              className="absolute inset-0 w-full h-full object-cover"
              // Scale the video to cover the entire section
              iframeClassName="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%]"
            />
          </div>
        ) : (
          // Image background for pages without a videoId
          <Image
            src={getBannerImage()}
            alt={getTitle()}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          {getTitle()}
        </h1>
        {description && (
          <p className="text-xl text-white/90 max-w-2xl">
            {description}
          </p>
        )}
      </div>
    </section>
  );
} 