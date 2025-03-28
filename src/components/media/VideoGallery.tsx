"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { VideoType } from "@/types";
import { useChorus } from "@/contexts/ChorusContext";
import chorusContent from "@/data/chorusContent";
import useChorusStyles from "@/hooks/useChorusStyles";

interface VideoGalleryProps {
  videos: VideoType[];
}

export default function VideoGallery({ videos: allVideos }: VideoGalleryProps) {
  const { selectedChorus } = useChorus();
  const { primaryColor, primaryTextClass } = useChorusStyles();
  const [videos, setVideos] = useState<VideoType[]>(allVideos);

  useEffect(() => {
    // Filter videos based on selected chorus
    if (selectedChorus) {
      const filtered = allVideos.filter(
        video => video.chorus === selectedChorus || video.chorus === 'both'
      );
      // Sort by date in descending order (newest first)
      const sorted = [...filtered].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setVideos(sorted);
    } else {
      // Sort by date in descending order (newest first)
      const sorted = [...allVideos].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setVideos(sorted);
    }
  }, [allVideos, selectedChorus]);

  // Get the appropriate title based on the selected chorus
  const getTitle = () => {
    if (selectedChorus === 'harmony') {
      return "Parkside Harmony Videos";
    } else if (selectedChorus === 'melody') {
      return "Parkside Melody Videos";
    }
    return "Performance Videos";
  };

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">{getTitle()}</h2>
        <p className="text-lg text-gray-600">
          No videos are currently available for {selectedChorus ? chorusContent[selectedChorus].fullName : 'our choruses'}.
          Please check back soon!
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">{getTitle()}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg overflow-hidden shadow-md"
          >
            <div className="relative aspect-video cursor-pointer" onClick={() => window.open(video.url, '_blank')}>
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" style={{ color: primaryColor }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              {video.chorus !== 'both' && video.chorus !== null && (
                <div className="absolute top-3 right-3 bg-white text-sm font-medium py-1 px-2 rounded-md shadow-sm">
                  {video.chorus === 'harmony' ? 'Harmony' : 'Melody'}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800">{video.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{new Date(video.date).toLocaleDateString()}</p>
              <p className="text-gray-600 mt-2 line-clamp-2">{video.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 