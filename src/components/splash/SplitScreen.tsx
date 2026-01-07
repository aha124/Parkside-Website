"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useChorus, ChorusType } from "@/lib/chorus-context";
import type { SiteSettings } from "@/types/admin";

// Default slide data for mobile carousel
const defaultSlides = [
  {
    id: "voices",
    chorus: "voices" as ChorusType,
    title: "Parkside Voices",
    subtitle: "Hershey Chapter - BHS",
    description: "Experience the best of both worlds. Explore our award-winning barbershop choruses.",
    defaultImage: "/images/hero-bg.jpg",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
  },
  {
    id: "harmony",
    chorus: "harmony" as ChorusType,
    title: "Parkside Harmony",
    subtitle: "A Cappella Chorus",
    description: "Award-winning a cappella chorus performing in the traditional four-part barbershop harmony style.",
    defaultImage: "/images/harmony-bg.jpg",
    buttonColor: "bg-indigo-600 hover:bg-indigo-700",
  },
  {
    id: "melody",
    chorus: "melody" as ChorusType,
    title: "Parkside Melody",
    subtitle: "Treble-Voiced Ensemble",
    description: "Vibrant treble-voiced ensemble bringing exceptional a cappella performances to the Hershey area.",
    defaultImage: "/images/melody-bg.jpg",
    buttonColor: "bg-amber-600 hover:bg-amber-700",
  },
];

const SplitScreen = () => {
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | "center" | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const { setChorus } = useChorus();
  const router = useRouter();

  // Fetch site settings for custom backgrounds
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/admin/site-settings");
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

  // Get background image for a chorus, using custom from settings or default
  const getBackgroundImage = (chorusId: string) => {
    const customBg = siteSettings?.splashBackgrounds?.[chorusId as keyof typeof siteSettings.splashBackgrounds];
    if (customBg) return customBg;
    const slide = defaultSlides.find(s => s.id === chorusId);
    return slide?.defaultImage || "/images/hero-bg.jpg";
  };

  // Detect mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Hide swipe hint after first interaction or timeout
  useEffect(() => {
    const timer = setTimeout(() => setShowSwipeHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleChorusSelect = (chorus: ChorusType) => {
    setChorus(chorus);
    router.push("/home");
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setShowSwipeHint(false);
    setDirection(newDirection);
    setCurrentSlide((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = defaultSlides.length - 1;
      if (next >= defaultSlides.length) next = 0;
      return next;
    });
  };

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  // Mobile swipeable carousel
  if (isMobile) {
    const slide = defaultSlides[currentSlide];

    return (
      <div className="h-screen w-screen overflow-hidden bg-gray-900 relative">
        {/* Background image with parallax effect */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id + "-bg"}
            className="absolute inset-0"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={getBackgroundImage(slide.id)}
              alt={slide.title}
              fill
              className="object-cover"
              priority
            />
            {/* Subtle dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/30" />
          </motion.div>
        </AnimatePresence>

        {/* Swipeable content area */}
        <motion.div
          className="absolute inset-0 flex flex-col"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          {/* Top section - Logo */}
          <div className="flex-shrink-0 pt-8 pb-4 flex justify-center relative z-10">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/95 rounded-full shadow-2xl flex items-center justify-center backdrop-blur-sm">
                <Image
                  src="/images/parkside-logo copy.png"
                  alt="Parkside"
                  width={80}
                  height={80}
                  className="object-contain w-[85%] h-[85%]"
                />
              </div>
            </motion.div>
          </div>

          {/* Main content - Animated */}
          <div className="flex-1 flex flex-col justify-center px-6 relative z-10">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id}
                custom={direction}
                initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="text-center"
              >
                {/* Glassmorphism card */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
                  <motion.h1
                    className="text-3xl sm:text-4xl font-bold text-white mb-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {slide.title}
                  </motion.h1>

                  <motion.p
                    className="text-white/80 text-sm sm:text-base font-medium mb-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    {slide.subtitle}
                  </motion.p>

                  <motion.p
                    className="text-white/90 text-sm sm:text-base leading-relaxed mb-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {slide.description}
                  </motion.p>

                  <motion.button
                    onClick={() => handleChorusSelect(slide.chorus)}
                    className={`${slide.buttonColor} text-white font-semibold py-3 px-8 rounded-full text-base sm:text-lg shadow-lg active:scale-95 transition-all duration-200`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Enter Site
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom section - Navigation */}
          <div className="flex-shrink-0 pb-8 pt-4 relative z-10">
            {/* Swipe hint */}
            <AnimatePresence>
              {showSwipeHint && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center mb-4"
                >
                  <motion.p
                    className="text-white/60 text-xs flex items-center justify-center gap-2"
                    animate={{ x: [0, 10, 0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    Swipe to explore
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dot indicators */}
            <div className="flex justify-center gap-3">
              {defaultSlides.map((s, index) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setDirection(index > currentSlide ? 1 : -1);
                    setCurrentSlide(index);
                    setShowSwipeHint(false);
                  }}
                  className="group relative p-2"
                  aria-label={`Go to ${s.title}`}
                >
                  <motion.div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-white w-8"
                        : "bg-white/40 w-2 group-hover:bg-white/60"
                    }`}
                    layoutId="dot-indicator"
                  />
                </button>
              ))}
            </div>

            {/* Quick navigation buttons */}
            <div className="flex justify-center gap-2 mt-4">
              {defaultSlides.map((s, index) => (
                <button
                  key={s.id + "-quick"}
                  onClick={() => {
                    setDirection(index > currentSlide ? 1 : -1);
                    setCurrentSlide(index);
                    setShowSwipeHint(false);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-white text-gray-900 font-medium"
                      : "bg-white/20 text-white/80 hover:bg-white/30"
                  }`}
                >
                  {s.id === "voices" ? "Both" : s.id === "harmony" ? "Harmony" : "Melody"}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Edge swipe indicators */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20">
          <motion.button
            onClick={() => paginate(-1)}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white/60 hover:bg-white/20 hover:text-white transition-all"
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20">
          <motion.button
            onClick={() => paginate(1)}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white/60 hover:bg-white/20 hover:text-white transition-all"
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>
    );
  }

  // Desktop/tablet layout with hover animations (unchanged)
  return (
    <div className="h-screen w-screen flex relative overflow-hidden">
      {/* Left Side - Parkside Harmony */}
      <motion.div
        className="w-1/2 h-full relative flex items-center justify-center"
        initial={{ width: "50%" }}
        animate={{
          width: hoveredSide === "left" ? "55%" :
                 hoveredSide === "right" ? "45%" : "50%"
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        onMouseEnter={() => setHoveredSide("left")}
        onMouseLeave={() => setHoveredSide(null)}
      >
        <div className="absolute inset-0 z-0">
          <motion.div
            className="relative w-full h-full"
            animate={{
              scale: hoveredSide === "left" ? 1.05 : 1
            }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <div className="relative w-full h-full">
              <Image
                src={getBackgroundImage("harmony")}
                alt="Parkside Harmony Chorus"
                fill
                style={{
                  objectFit: "cover",
                  filter: "grayscale(1)"
                }}
                priority
              />
            </div>
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        </div>

        <motion.div
          className="z-10 text-white text-center px-4"
          animate={{
            scale: hoveredSide === "left" ? 1.1 : 1,
            opacity: hoveredSide === "right" ? 0.7 : 1
          }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Parkside Harmony</h2>
          <p className="text-base md:text-lg lg:text-xl max-w-md mx-auto">Award-winning a cappella chorus performing in the barbershop tradition.</p>
          <button
            onClick={() => handleChorusSelect("harmony")}
            className="mt-4 md:mt-6 px-5 md:px-6 py-2 bg-white text-gray-900 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            Enter
          </button>
        </motion.div>
      </motion.div>

      {/* Center Logo */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer flex flex-col items-center"
        animate={{
          scale: hoveredSide === "center" ? 1.1 : 1
        }}
        transition={{ duration: 0.5 }}
        onMouseEnter={() => setHoveredSide("center")}
        onMouseLeave={() => setHoveredSide(null)}
      >
        <button
          onClick={() => handleChorusSelect("voices")}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="bg-white rounded-full shadow-lg flex items-center justify-center w-32 h-32 md:w-48 md:h-48 lg:w-60 lg:h-60">
            <Image
              src="/images/parkside-logo copy.png"
              alt="Parkside Voices"
              width={230}
              height={230}
              className="object-contain w-[90%] h-[90%]"
            />
          </div>
          <div className="text-white text-center mt-3 md:mt-4 bg-black/50 px-4 md:px-6 py-2 md:py-3 rounded-md">
            <p className="font-medium text-sm md:text-base lg:text-lg">Parkside Voices</p>
            <p className="text-xs md:text-sm lg:text-base">Hershey Chapter - BHS</p>
          </div>
        </button>
      </motion.div>

      {/* Right Side - Parkside Melody */}
      <motion.div
        className="w-1/2 h-full relative flex items-center justify-center"
        initial={{ width: "50%" }}
        animate={{
          width: hoveredSide === "right" ? "55%" :
                 hoveredSide === "left" ? "45%" : "50%"
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        onMouseEnter={() => setHoveredSide("right")}
        onMouseLeave={() => setHoveredSide(null)}
      >
        <div className="absolute inset-0 z-0">
          <motion.div
            className="relative w-full h-full"
            animate={{
              scale: hoveredSide === "right" ? 1.05 : 1
            }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <div className="relative w-full h-full">
              <Image
                src={getBackgroundImage("melody")}
                alt="Parkside Melody Chorus"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
              <div className="absolute inset-0 bg-[#704214]/30" style={{ mixBlendMode: 'color' }}></div>
            </div>
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        </div>

        <motion.div
          className="z-10 text-white text-center px-4"
          animate={{
            scale: hoveredSide === "right" ? 1.1 : 1,
            opacity: hoveredSide === "left" ? 0.7 : 1
          }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Parkside Melody</h2>
          <p className="text-base md:text-lg lg:text-xl max-w-md mx-auto">Exceptional treble-voiced ensemble bringing vibrant a cappella performances to the Hershey area.</p>
          <button
            onClick={() => handleChorusSelect("melody")}
            className="mt-4 md:mt-6 px-5 md:px-6 py-2 bg-white text-gray-900 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            Enter
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SplitScreen;
