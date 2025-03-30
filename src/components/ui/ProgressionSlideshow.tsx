'use client';

import { useState, useEffect, SyntheticEvent } from 'react';
import Image from 'next/image';

export default function ProgressionSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    '/images/progression_slideshow/486610174_1184361726869488_6607344270866660077_n.jpg',
    '/images/progression_slideshow/449836513_986240160014980_5825839462645696238_n.jpg',
    '/images/progression_slideshow/450764053_989175329721463_2059697644769357557_n.jpg',
    '/images/progression_slideshow/465985050_9053735974651037_2407547990145555563_n.jpg',
    '/images/progression_slideshow/33436055_1908856165805756_2870732685829996544_n.jpg',
    '/images/progression_slideshow/89913645_3063454110345950_98533327228633088_n.jpg',
    '/images/progression_slideshow/473986103_1131335942172067_2950776997912407805_n.jpg',
    '/images/progression_slideshow/482239277_1173135291325465_2728553905203122821_n.jpg',
    '/images/progression_slideshow/484998963_1180115943960733_2826235463293067643_n.jpg',
    '/images/progression_slideshow/485960272_1181494160489578_1390264330564151433_n.jpg',
    '/images/progression_slideshow/468600270_1094171585888503_1861956066376855920_n.jpg'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [images.length]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-2xl group">
      {/* Slideshow */}
      {images.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 w-full h-full transition-opacity duration-1000 flex items-center justify-center"
          style={{
            opacity: currentIndex === index ? 1 : 0,
            zIndex: currentIndex === index ? 1 : 0,
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src={src}
              alt={`Parkside community moment ${index + 1}`}
              fill
              className="object-contain bg-black/90"
              priority={index === 0}
            />
          </div>
        </div>
      ))}

      {/* Navigation arrows - only visible on hover */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70 z-20"
        aria-label="Previous image"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70 z-20"
        aria-label="Next image"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
        <p className="text-lg md:text-xl font-medium text-center">
          Sharing harmony with our community
        </p>
      </div>

      {/* Dots navigation */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'bg-white w-4' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 