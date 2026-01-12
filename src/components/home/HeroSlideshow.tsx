"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useChorus } from "@/lib/chorus-context";
import type { SiteSettings } from "@/types/admin";

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
  chorusAware?: boolean; // If true, this slide's image changes based on chorus selection
}

// Define the component props
interface HeroSlideshowProps {
  interval?: number; // Time in milliseconds between slides
}

export default function HeroSlideshow({ interval = 5000 }: HeroSlideshowProps) {
  const { chorus } = useChorus();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Fetch site settings for custom hero slide backgrounds
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/site-settings");
        const data = await response.json();
        if (data.success) {
          setSiteSettings(data.data);
        }
      } catch (error) {
        console.error("Error fetching site settings:", error);
      }
    };
    fetchSettings();
  }, []);

  // Get the hero slide background based on chorus selection
  const getHeroSlideBackground = () => {
    const customBg = siteSettings?.heroSlideBackground?.[chorus];
    if (customBg) return customBg;
    // Default fallback based on chorus
    switch (chorus) {
      case "harmony":
        return "/images/harmony-bg.jpg";
      case "melody":
        return "/images/melody-bg.jpg";
      default:
        return "/images/slideshow/slide1-main.jpg";
    }
  };

  // Define the slides
  const slides: Slide[] = [
    {
      id: 1,
      title: "Parkside Hershey, PA",
      description: "The Hershey Chapter of the Barbershop Harmony Society, featuring Parkside Harmony and Parkside Melody a cappella choruses.",
      imageUrl: getHeroSlideBackground(),
      fallbackImageUrl: "/images/hero-bg.jpg",
      buttonText: "Learn More",
      buttonUrl: "/about",
      secondaryButtonText: "Join Us",
      secondaryButtonUrl: "/contact",
      chorusAware: true,
    },
    {
      id: 2,
      title: "Parkside Progression",
      description: "Support our mission to bring barbershop harmony to the Hershey community through your generous donations.",
      imageUrl: "/images/slideshow/slide2-donate.jpg",
      fallbackImageUrl: "/images/harmony-bg.jpg",
      buttonText: "Donate Now",
      buttonUrl: "/donate"
    },
    {
      id: 3,
      title: "Join Our Rehearsals",
      description: "Interested in singing with us? Come to our rehearsals as a guest and experience the joy of barbershop harmony.",
      imageUrl: "/images/slideshow/slide3-events.jpg",
      fallbackImageUrl: "/images/melody-bg.jpg",
      buttonText: "Upcoming Events",
      buttonUrl: "/events"
    },
    {
      id: 4,
      title: "Parkside Gear",
      description: "Show your support for Parkside Harmony and Melody with our branded merchandise.",
      imageUrl: "/images/slideshow/slide4-shop.jpg",
      fallbackImageUrl: "/images/harmony-bg.jpg",
      buttonText: "Shop Now",
      buttonUrl: "/shop"
    },
    {
      id: 5,
      title: "Get In Touch",
      description: "Have questions or want to book us for your event? We'd love to hear from you!",
      imageUrl: "/images/slideshow/slide5-contact.jpg",
      fallbackImageUrl: "/images/melody-bg.jpg",
      buttonText: "Contact Us",
      buttonUrl: "/contact"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageSources, setImageSources] = useState<string[]>(
    slides.map(slide => slide.imageUrl)
  );

  // Update first slide image when chorus or settings change
  useEffect(() => {
    const customBg = siteSettings?.heroSlideBackground?.[chorus];
    let newBg: string;
    if (customBg) {
      newBg = customBg;
    } else {
      switch (chorus) {
        case "harmony":
          newBg = "/images/harmony-bg.jpg";
          break;
        case "melody":
          newBg = "/images/melody-bg.jpg";
          break;
        default:
          newBg = "/images/slideshow/slide1-main.jpg";
      }
    }
    setImageSources(prev => {
      const newSources = [...prev];
      newSources[0] = newBg;
      return newSources;
    });
  }, [chorus, siteSettings]);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);
    
    return () => clearTimeout(timer);
  }, [currentSlide, interval, isAutoPlaying, slides.length]);

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
    setImageSources(prev => {
      const newSources = [...prev];
      newSources[index] = slides[index].fallbackImageUrl;
      return newSources;
    });
  };

  return (
    <section
      className="relative h-[300px] sm:h-[400px] md:h-[500px] bg-gray-900"
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
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4">
              {slides[currentSlide].title}
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-white/90 max-w-2xl mb-4 sm:mb-6 md:mb-8">
              {slides[currentSlide].description}
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <Link
                href={slides[currentSlide].buttonUrl}
                className="bg-white text-gray-900 hover:bg-gray-100 px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-colors text-sm sm:text-base"
              >
                {slides[currentSlide].buttonText}
              </Link>
              {slides[currentSlide].secondaryButtonText && (
                <Link
                  href={slides[currentSlide].secondaryButtonUrl || "#"}
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-colors text-sm sm:text-base"
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
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
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
    </section>
  );
} 