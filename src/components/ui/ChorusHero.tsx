"use client";

import Image from "next/image";
import { useChorus } from "@/contexts/ChorusContext";
import chorusContent from "@/data/chorusContent";
import { useChorusStyles } from "@/contexts/StyleContext";
import dynamic from "next/dynamic";
import type { YouTubeProps } from "react-youtube";
import { useEffect, useState, useRef } from 'react';

// Dynamically import YouTube component to avoid SSR issues
const YouTube = dynamic(() => import("react-youtube"), { ssr: false });

interface ChorusHeroProps {
  page: 'home' | 'about' | 'events' | 'media' | 'join' | 'contact' | 'leadership';
  title: string;
  description?: string;
  height?: string;
  videoId?: string; // Optional video ID for video backgrounds
  youtubeOpts?: YouTubeProps['opts']; // Add optional YouTube options prop
}

export default function ChorusHero({ page, title, description, height = "500px", videoId, youtubeOpts }: ChorusHeroProps) {
  const { selectedChorus } = useChorus();
  const { primaryColor } = useChorusStyles();
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Handle scroll events for parallax and dynamic height
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const vh = window.innerHeight;
      const scrollProgress = Math.min(scrolled / vh, 1);
      setScrollY(scrollProgress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Video options for YouTube
  const defaultOpts: YouTubeProps['opts'] = {
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
  
  // Use provided options or default
  const opts = youtubeOpts || defaultOpts;

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
          : page === 'about'
            ? '/images/both/about/hero.jpg'
            : `/images/placeholder-hero.jpg`;
    }
  };
  
  // Handle image loading error
  const handleImageError = () => {
    console.error(`Failed to load hero image for ${page} page with chorus ${selectedChorus}`);
    // The component will use fallback styling if the image fails to load
  };

  // Get the appropriate title based on the selected chorus
  const getTitle = () => {
    if (selectedChorus) {
      return title.replace('Parkside', `Parkside ${selectedChorus.charAt(0).toUpperCase() + selectedChorus.slice(1)}`);
    }
    return title;
  };

  return (
    <section 
      ref={heroRef}
      className="relative" 
      style={{ 
        height: `${Math.max(70 - (scrollY * 40), 30)}vh`,
        minHeight: '300px',
        transition: 'height 300ms'
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full" 
          style={{ transform: `translateY(${scrollY * 50}px)` }}
        >
          {videoId ? (
            // Video background for pages that have a videoId
            <div className="absolute inset-0 w-full h-full">
              <YouTube
                videoId={videoId}
                opts={opts}
                className="absolute inset-0 w-full h-full object-cover"
                // Scale the video to cover the entire section
                iframeClassName="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%]"
                onReady={() => setVideoLoaded(true)}
              />
              
              {/* Fallback image while video loads */}
              {!videoLoaded && (
                <Image
                  src={getBannerImage()}
                  alt={getTitle()}
                  fill
                  className="object-cover"
                  priority
                  onError={handleImageError}
                  unoptimized
                />
              )}
            </div>
          ) : (
            // Image background for pages without a videoId
            <Image
              src={getBannerImage()}
              alt={getTitle()}
              fill
              className="object-cover"
              priority
              onError={handleImageError}
              unoptimized
            />
          )}
          <div className="absolute inset-0 bg-black/60" />
        </div>
      </div>
      
      <div 
        className="relative container mx-auto px-4 h-full flex flex-col justify-center"
        style={{
          transform: `translateY(${scrollY * 30}px)`,
          opacity: Math.max(1 - scrollY * 1.5, 0),
        }}
      >
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          {getTitle()}
        </h1>
        {description && (
          <p className="text-xl text-white/90 max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {/* Scroll indicator */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce transition-opacity duration-300"
        style={{
          opacity: Math.max(1 - scrollY * 2, 0),
        }}
      >
        <svg 
          className="w-6 h-6 text-white"
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
} 