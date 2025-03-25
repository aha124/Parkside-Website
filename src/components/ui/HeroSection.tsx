'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import ScrollAnimation from './ScrollAnimation';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  imagePath?: string;
  imageAlt?: string;
  videoId?: string;
  children?: React.ReactNode;
}

export default function HeroSection({
  title,
  subtitle,
  imagePath,
  imageAlt,
  videoId,
  children
}: HeroSectionProps) {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

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

  return (
    <div 
      ref={heroRef}
      className="relative flex items-center justify-center overflow-hidden transition-[height] duration-300"
      style={{ 
        height: `${Math.max(70 - (scrollY * 40), 30)}vh`,
        minHeight: '300px',
      }}
    >
      {/* Background Media */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `translateY(${scrollY * 50}px)`,
        }}
      >
        {videoId ? (
          <>
            {/* YouTube iframe for background */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&showinfo=0&rel=0&modestbranding=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className={`absolute top-1/2 left-1/2 w-[120%] h-[120%] -translate-x-1/2 -translate-y-1/2 ${videoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
                style={{ 
                  pointerEvents: 'none',
                  border: 'none',
                }}
                onLoad={() => setVideoLoaded(true)}
              />
            </div>
            {/* Fallback image while video loads */}
            {imagePath && !videoLoaded && (
              <Image
                src={imagePath}
                alt={imageAlt || "Hero background"}
                fill
                className="object-cover"
                priority
              />
            )}
          </>
        ) : imagePath ? (
          <div className="relative w-full h-full">
            <div className="absolute inset-0">
              <div className="relative w-full h-full transform-gpu animate-subtle-zoom">
                <Image
                  src={imagePath}
                  alt={imageAlt || "Hero background"}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ) : null}
        
        {/* Overlay gradient */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20"
          style={{
            opacity: 0.6 + scrollY * 0.4,
          }}
        />
      </div>

      {/* Content */}
      <div 
        className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto transition-transform duration-300"
        style={{
          transform: `translateY(${scrollY * 30}px)`,
          opacity: Math.max(1 - scrollY * 1.5, 0),
        }}
      >
        <ScrollAnimation>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl lg:text-2xl text-gray-200">
              {subtitle}
            </p>
          )}
          {children}
        </ScrollAnimation>
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
    </div>
  );
} 