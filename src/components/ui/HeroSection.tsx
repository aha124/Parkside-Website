'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ScrollAnimation from './ScrollAnimation';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  imagePath: string;
  imageAlt: string;
  children?: React.ReactNode;
}

export default function HeroSection({ title, subtitle, imagePath, imageAlt, children }: HeroSectionProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleArrowClick = () => {
    const heroHeight = window.innerHeight * 0.5; // 50vh
    window.scrollTo({
      top: heroHeight,
      behavior: 'smooth'
    });
  };

  // Calculate the transform value based on scroll position
  // This will move the background image up as user scrolls down
  const transformValue = Math.min(scrollY * 0.5, 300); // Max transform of 300px
  const opacityValue = Math.max(1 - scrollY * 0.002, 0.3); // Min opacity of 0.3

  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${transformValue}px)`,
          opacity: opacityValue,
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay */}
        <Image
          src={imagePath}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <ScrollAnimation>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
              {subtitle}
            </p>
          )}
          {children}
        </ScrollAnimation>

        {/* Scroll Arrow */}
        <button
          onClick={handleArrowClick}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
          aria-label="Scroll to content"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </section>
  );
} 