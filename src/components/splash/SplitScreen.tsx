"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const SplitScreen = () => {
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | "center" | null>(null);

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
          className="z-10 text-white text-center"
          animate={{ 
            scale: hoveredSide === "left" ? 1.1 : 1,
            opacity: hoveredSide === "right" ? 0.7 : 1
          }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-5xl font-bold mb-4">Parkside Harmony</h2>
          <p className="text-xl max-w-md mx-auto">Award-winning men&apos;s a cappella chorus performing in the barbershop tradition.</p>
          <Link href="/choruses/harmony">
            <button className="mt-6 px-6 py-2 bg-white text-gray-900 rounded-md font-medium hover:bg-gray-100 transition-colors">
              Learn More
            </button>
          </Link>
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
        <Link href="/home" className="flex flex-col items-center">
          <div className="bg-white rounded-full shadow-lg flex items-center justify-center" style={{ width: '240px', height: '240px' }}>
            <Image 
              src="/images/parkside-logo copy.png" 
              alt="Parkside Barbershop Harmony Society"
              width={230}
              height={230}
              className="object-contain"
              style={{ maxWidth: '98%', maxHeight: '98%' }}
            />
          </div>
          <div className="text-white text-center mt-4 bg-black/50 px-6 py-3 rounded-md">
            <p className="font-medium text-lg">Hershey Chapter</p>
            <p className="text-base">Barbershop Harmony Society</p>
          </div>
        </Link>
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
          className="z-10 text-white text-center"
          animate={{ 
            scale: hoveredSide === "right" ? 1.1 : 1,
            opacity: hoveredSide === "left" ? 0.7 : 1
          }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-5xl font-bold mb-4">Parkside Melody</h2>
          <p className="text-xl max-w-md mx-auto">Exceptional treble chorus bringing vibrant a cappella performances to the Hershey area.</p>
          <Link href="/choruses/melody">
            <button className="mt-6 px-6 py-2 bg-white text-gray-900 rounded-md font-medium hover:bg-gray-100 transition-colors">
              Learn More
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SplitScreen; 