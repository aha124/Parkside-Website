"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useChorus } from "@/contexts/ChorusContext";

// Define the slide interface
interface Slide {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  fallbackImageUrl: string;
  buttonText: string;
  buttonUrl: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
}

// Define the component props
interface HeroSlideshowProps {
  interval?: number; // Time in milliseconds between slides
}

export default function HeroSlideshow({ interval = 5000 }: HeroSlideshowProps) {
  const { selectedChorus } = useChorus();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Get the appropriate path for slideshow images based on selected chorus
  const getSlideshowPath = () => {
    if (selectedChorus === 'harmony') {
      return '/images/harmony/slideshow/';
    } else if (selectedChorus === 'melody') {
      return '/images/melody/slideshow/';
    } else {
      return '/images/both/slideshow/';
    }
  };
  
  // Get the slideshow path
  const slideshowPath = getSlideshowPath();
  
  // Define the slides using useMemo
  const slides = useMemo<Slide[]>(() => [
    {
      id: 1,
      title: selectedChorus === 'harmony' 
        ? "Parkside Harmony" 
        : selectedChorus === 'melody' 
          ? "Parkside Melody" 
          : "Parkside Hershey, PA",
      description: selectedChorus === 'harmony'
        ? "Award-winning men's a cappella chorus performing in the barbershop tradition."
        : selectedChorus === 'melody'
          ? "Stunning clarity and cutting-edge harmonies from this award-winning a cappella treble chorus"
          : "The Hershey Chapter of the Barbershop Harmony Society, featuring Parkside Harmony and Parkside Melody a cappella choruses.",
      imageUrl: `${slideshowPath}slide1-main.jpg`,
      fallbackImageUrl: selectedChorus === 'harmony' 
        ? "/images/harmony-bg.jpg" 
        : selectedChorus === 'melody' 
          ? "/images/melody-bg.jpg" 
          : "/images/hero-bg.jpg",
      buttonText: "Learn More",
      buttonUrl: "/about",
      secondaryButtonText: "Join Us",
      secondaryButtonUrl: "/contact"
    },
    {
      id: 2,
      title: "Support Our Mission",
      description: "Help us bring a cappella harmony to the Hershey community through your generous donations.",
      imageUrl: `${slideshowPath}slide2-donate.jpg`,
      fallbackImageUrl: selectedChorus === 'harmony' 
        ? "/images/harmony-bg.jpg" 
        : selectedChorus === 'melody' 
          ? "/images/melody-bg.jpg" 
          : "/images/hero-bg.jpg",
      buttonText: "Donate Now",
      buttonUrl: "/donate"
    },
    {
      id: 3,
      title: "Join Our Rehearsals",
      description: selectedChorus === 'harmony'
        ? "Interested in singing with Parkside Harmony? Come to our rehearsals as a guest and experience the joy of barbershop."
        : selectedChorus === 'melody'
          ? "Interested in singing with Parkside Melody? Come to our rehearsals as a guest and experience the joy of a cappella."
          : "Interested in singing with us? Come to our rehearsals as a guest and experience the joy of a cappella harmony.",
      imageUrl: `${slideshowPath}slide3-events.jpg`,
      fallbackImageUrl: selectedChorus === 'harmony' 
        ? "/images/harmony-bg.jpg" 
        : selectedChorus === 'melody' 
          ? "/images/melody-bg.jpg" 
          : "/images/hero-bg.jpg",
      buttonText: "Upcoming Events",
      buttonUrl: "/events"
    },
    {
      id: 4,
      title: selectedChorus === 'harmony' 
        ? "Harmony Gear" 
        : selectedChorus === 'melody' 
          ? "Melody Gear" 
          : "Parkside Gear",
      description: "Show your support with our branded merchandise.",
      imageUrl: `${slideshowPath}slide4-shop.jpg`,
      fallbackImageUrl: selectedChorus === 'harmony' 
        ? "/images/harmony-bg.jpg" 
        : selectedChorus === 'melody' 
          ? "/images/melody-bg.jpg" 
          : "/images/hero-bg.jpg",
      buttonText: "Shop Now",
      buttonUrl: "/shop"
    },
    {
      id: 5,
      title: "Get In Touch",
      description: "Have questions or want to book us for your event? We'd love to hear from you!",
      imageUrl: `${slideshowPath}slide5-contact.jpg`,
      fallbackImageUrl: selectedChorus === 'harmony' 
        ? "/images/harmony-bg.jpg" 
        : selectedChorus === 'melody' 
          ? "/images/melody-bg.jpg" 
          : "/images/hero-bg.jpg",
      buttonText: "Contact Us",
      buttonUrl: "/contact"
    }
  ], [selectedChorus, slideshowPath]);

  const [imageSources, setImageSources] = useState<string[]>(() =>
    slides.map(slide => slide.imageUrl)
  );

  // Handle scroll events for dynamic height and parallax
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

  // Initialize imageSources when slides array changes (due to selectedChorus change)
  useEffect(() => {
     setImageSources(slides.map(slide => slide.imageUrl));
  }, [slides]); // Now depends on the memoized slides array

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);
    
    return () => clearTimeout(timer);
  }, [currentSlide, interval, isAutoPlaying, slides]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Manual navigation
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Handle image error
  const handleImageError = (index: number) => {
    console.log(`Error loading image for slide ${index + 1}: ${imageSources[index]}`);
    setImageSources(prev => {
      const newSources = [...prev];
      
      // If the current path isn't working, try a different path
      if (newSources[index].includes(slideshowPath)) {
        // Try the default slideshow path first
        if (!slideshowPath.includes('/images/slideshow/')) {
          newSources[index] = `/images/slideshow/${newSources[index].split('/').pop() || ''}`;
          console.log(`Trying original slideshow path: ${newSources[index]}`);
          return newSources;
        }
      }
      
      // If we're already using a fallback path or the above didn't work, use the fallback image
      newSources[index] = slides[index].fallbackImageUrl;
      console.log(`Using fallback image: ${newSources[index]}`);
      return newSources;
    });
  };

  return (
    <section 
      ref={heroRef}
      className="relative bg-gray-900 transition-all duration-300"
      style={{ 
        height: `${Math.max(70 - (scrollY * 40), 30)}vh`,
        minHeight: '300px',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 50}px)`,
          }}
        >
          <Image
            src={imageSources[currentSlide]}
            alt={slides[currentSlide].title}
            fill
            className="object-cover"
            priority
            onError={() => handleImageError(currentSlide)}
          />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
      </AnimatePresence>
      
      {/* Content */}
      <div 
        className="relative container mx-auto px-4 h-full flex flex-col justify-center"
        style={{
          transform: `translateY(${scrollY * 30}px)`,
          opacity: Math.max(1 - scrollY * 1.5, 0),
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {slides[currentSlide].title}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mb-8">
              {slides[currentSlide].description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href={slides[currentSlide].buttonUrl}
                className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition-colors"
              >
                {slides[currentSlide].buttonText}
              </Link>
              {slides[currentSlide].secondaryButtonText && (
                <Link 
                  href={slides[currentSlide].secondaryButtonUrl || "#"}
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-md font-medium transition-colors"
                >
                  {slides[currentSlide].secondaryButtonText}
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation Arrows */}
      <button 
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        aria-label="Previous slide"
        style={{
          opacity: Math.max(1 - scrollY * 2, 0),
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        aria-label="Next slide"
        style={{
          opacity: Math.max(1 - scrollY * 2, 0),
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Dots Navigation */}
      <div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2"
        style={{
          opacity: Math.max(1 - scrollY * 2, 0),
        }}
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-white" : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
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