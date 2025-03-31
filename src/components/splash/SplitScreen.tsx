"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import Link from "next/link"; // Removed as unused
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useChorus } from "@/contexts/ChorusContext";

const SplitScreen = () => {
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | "center" | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState<"both" | "harmony" | "melody">("both");
  const { setChorus } = useChorus();
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleChorusSelection = (chorus: 'harmony' | 'melody' | null) => {
    setChorus(chorus);
    router.push('/home');
  };

  const handleMobileTap = (section: "harmony" | "melody") => {
    if (isMobile) {
      if (activeSection === "both") {
        setActiveSection(section);
      } else if (activeSection === section) {
        // If tapping the active section again, select that chorus
        handleChorusSelection(section);
      } else {
        // If tapping the other section, go back to both
        setActiveSection("both");
      }
    }
  };

  return (
    <div className={`h-screen w-screen ${isMobile ? 'flex flex-col' : 'flex'} relative overflow-hidden`}>
      {/* Left Side - Parkside Harmony */}
      <motion.div
        className={`${isMobile ? 'w-full' : 'w-1/2 h-full'} relative flex items-center justify-center transition-all duration-500`}
        initial={{ width: isMobile ? "100%" : "50%", height: isMobile ? (activeSection === "both" ? "50%" : activeSection === "harmony" ? "80%" : "20%") : "100%" }}
        animate={
          isMobile 
            ? { 
                height: activeSection === "both" ? "50%" : 
                       activeSection === "harmony" ? "80%" : "20%"
              } 
            : { 
                width: hoveredSide === "left" ? "55%" : 
                       hoveredSide === "right" ? "45%" : "50%" 
              }
        }
        transition={{ duration: 0.5, ease: "easeInOut" }}
        onMouseEnter={() => !isMobile && setHoveredSide("left")}
        onMouseLeave={() => !isMobile && setHoveredSide(null)}
        onClick={() => handleMobileTap("harmony")}
      >
        <div className="absolute inset-0 z-0">
          <motion.div
            className="relative w-full h-full"
            animate={{ 
              scale: (!isMobile && hoveredSide === "left") || (isMobile && activeSection === "harmony") ? 1.05 : 1
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
          className={`z-10 text-white text-center ${isMobile && activeSection === "melody" ? "opacity-0" : ""}`}
          animate={{ 
            scale: (!isMobile && hoveredSide === "left") || (isMobile && activeSection === "harmony") ? 1.1 : 1,
            opacity: (!isMobile && hoveredSide === "right") || (isMobile && activeSection === "melody") ? 0.7 : 1
          }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-bold mb-2 md:mb-4`}>Parkside Harmony</h2>
          <p className={`${isMobile ? 'text-sm' : 'text-xl'} max-w-md mx-auto px-4`}>Award-winning men&apos;s a cappella chorus performing in the barbershop tradition.</p>
          
          {isMobile && activeSection === "harmony" && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleChorusSelection('harmony');
              }}
              className="mt-3 md:mt-6 px-4 md:px-6 py-1 md:py-2 bg-white text-gray-900 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Select Harmony
            </button>
          )}

          {!isMobile && (
            <button 
              onClick={() => handleChorusSelection('harmony')}
              className="mt-3 md:mt-6 px-4 md:px-6 py-1 md:py-2 bg-white text-gray-900 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Select Harmony
            </button>
          )}
        </motion.div>
        
        {isMobile && activeSection === "harmony" && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
              <span className="text-xs text-white">Tap again to select or</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("both");
                }}
                className="ml-1 text-xs font-medium text-white underline"
              >
                go back
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Center Logo */}
      <AnimatePresence>
        {(activeSection === "both" || !isMobile) && (
          <motion.div
            className={`${isMobile ? 'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30' : 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20'} cursor-pointer flex flex-col items-center`}
            animate={{ 
              scale: hoveredSide === "center" ? 1.1 : 1,
              opacity: 1
            }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onMouseEnter={() => !isMobile && setHoveredSide("center")}
            onMouseLeave={() => !isMobile && setHoveredSide(null)}
          >
            <div 
              className="flex flex-col items-center"
              onClick={() => handleChorusSelection(null)}
            >
              <div className="bg-white rounded-full shadow-lg flex items-center justify-center" style={{ width: isMobile ? '120px' : '240px', height: isMobile ? '120px' : '240px' }}>
                <Image 
                  src="/images/parkside-logo copy.png" 
                  alt="Parkside Barbershop Harmony Society"
                  width={isMobile ? 115 : 230}
                  height={isMobile ? 115 : 230}
                  className="object-contain"
                  style={{ maxWidth: '98%', maxHeight: '98%' }}
                />
              </div>
              <div className="text-white text-center mt-2 md:mt-4 bg-black/50 px-3 py-1 md:px-6 md:py-3 rounded-md">
                <p className={`font-medium ${isMobile ? 'text-sm' : 'text-lg'}`}>Hershey Chapter</p>
                <p className={isMobile ? 'text-xs' : 'text-base'}>Barbershop Harmony Society</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Side - Parkside Melody */}
      <motion.div
        className={`${isMobile ? 'w-full' : 'w-1/2 h-full'} relative flex items-center justify-center transition-all duration-500`}
        initial={{ width: isMobile ? "100%" : "50%", height: isMobile ? (activeSection === "both" ? "50%" : activeSection === "melody" ? "80%" : "20%") : "100%" }}
        animate={
          isMobile 
            ? { 
                height: activeSection === "both" ? "50%" : 
                       activeSection === "melody" ? "80%" : "20%"
              } 
            : { 
                width: hoveredSide === "right" ? "55%" : 
                       hoveredSide === "left" ? "45%" : "50%" 
              }
        }
        transition={{ duration: 0.5, ease: "easeInOut" }}
        onMouseEnter={() => !isMobile && setHoveredSide("right")}
        onMouseLeave={() => !isMobile && setHoveredSide(null)}
        onClick={() => handleMobileTap("melody")}
      >
        <div className="absolute inset-0 z-0">
          <motion.div
            className="relative w-full h-full"
            animate={{ 
              scale: (!isMobile && hoveredSide === "right") || (isMobile && activeSection === "melody") ? 1.05 : 1
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
          className={`z-10 text-white text-center ${isMobile && activeSection === "harmony" ? "opacity-0" : ""}`}
          animate={{ 
            scale: (!isMobile && hoveredSide === "right") || (isMobile && activeSection === "melody") ? 1.1 : 1,
            opacity: (!isMobile && hoveredSide === "left") || (isMobile && activeSection === "harmony") ? 0.7 : 1
          }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-bold mb-2 md:mb-4`}>Parkside Melody</h2>
          <p className={`${isMobile ? 'text-sm' : 'text-xl'} max-w-md mx-auto px-4`}>Exceptional treble chorus bringing vibrant a cappella performances to the Hershey area.</p>
          
          {isMobile && activeSection === "melody" && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleChorusSelection('melody');
              }}
              className="mt-3 md:mt-6 px-4 md:px-6 py-1 md:py-2 bg-white text-gray-900 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Select Melody
            </button>
          )}

          {!isMobile && (
            <button 
              onClick={() => handleChorusSelection('melody')}
              className="mt-3 md:mt-6 px-4 md:px-6 py-1 md:py-2 bg-white text-gray-900 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Select Melody
            </button>
          )}
        </motion.div>

        {isMobile && activeSection === "melody" && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
              <span className="text-xs text-white">Tap again to select or</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("both");
                }}
                className="ml-1 text-xs font-medium text-white underline"
              >
                go back
              </button>
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Mobile Instruction */}
      {isMobile && activeSection === "both" && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-sm text-white">Tap a section to explore</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SplitScreen; 