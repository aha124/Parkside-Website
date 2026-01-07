"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useChorus, ChorusType } from "@/lib/chorus-context";

const SplitScreen = () => {
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | "center" | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { setChorus } = useChorus();
  const router = useRouter();

  // Detect mobile/tablet for disabling hover animations
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleChorusSelect = (chorus: ChorusType) => {
    setChorus(chorus);
    router.push("/home");
  };

  // On mobile, we use a stacked layout with a different structure
  if (isMobile) {
    return (
      <div className="min-h-screen w-screen flex flex-col relative overflow-hidden">
        {/* Center Logo - Fixed at top on mobile */}
        <div className="relative z-20 flex flex-col items-center py-6 bg-gradient-to-b from-gray-900 to-transparent">
          <button
            onClick={() => handleChorusSelect("voices")}
            className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
          >
            <div className="bg-white rounded-full shadow-lg flex items-center justify-center w-28 h-28 sm:w-36 sm:h-36">
              <Image
                src="/images/parkside-logo copy.png"
                alt="Parkside Voices"
                width={120}
                height={120}
                className="object-contain w-[90%] h-[90%]"
              />
            </div>
            <div className="text-white text-center mt-3 bg-black/60 px-4 py-2 rounded-md">
              <p className="font-medium text-sm sm:text-base">Parkside Voices</p>
              <p className="text-xs sm:text-sm">Hershey Chapter - BHS</p>
            </div>
          </button>
        </div>

        {/* Harmony Section */}
        <div className="flex-1 min-h-[40vh] relative flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/harmony-bg.jpg"
              alt="Parkside Harmony Chorus"
              fill
              style={{
                objectFit: "cover",
                filter: "grayscale(1)"
              }}
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="z-10 text-white text-center px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Parkside Harmony</h2>
            <p className="text-sm sm:text-base max-w-sm mx-auto mb-4">Award-winning bass clef a cappella chorus performing in the barbershop tradition.</p>
            <button
              onClick={() => handleChorusSelect("harmony")}
              className="px-5 py-2 bg-white text-gray-900 rounded-md font-medium active:bg-gray-200 transition-colors text-sm sm:text-base"
            >
              Enter
            </button>
          </div>
        </div>

        {/* Melody Section */}
        <div className="flex-1 min-h-[40vh] relative flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/melody-bg.jpg"
              alt="Parkside Melody Chorus"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
            <div className="absolute inset-0 bg-[#704214]/30" style={{ mixBlendMode: 'color' }}></div>
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="z-10 text-white text-center px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Parkside Melody</h2>
            <p className="text-sm sm:text-base max-w-sm mx-auto mb-4">Exceptional treble clef chorus bringing vibrant a cappella performances to the Hershey area.</p>
            <button
              onClick={() => handleChorusSelect("melody")}
              className="px-5 py-2 bg-white text-gray-900 rounded-md font-medium active:bg-gray-200 transition-colors text-sm sm:text-base"
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop/tablet layout with hover animations
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
                src="/images/harmony-bg.jpg"
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
          <p className="text-base md:text-lg lg:text-xl max-w-md mx-auto">Award-winning bass clef a cappella chorus performing in the barbershop tradition.</p>
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
                src="/images/melody-bg.jpg"
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
          <p className="text-base md:text-lg lg:text-xl max-w-md mx-auto">Exceptional treble clef chorus bringing vibrant a cappella performances to the Hershey area.</p>
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