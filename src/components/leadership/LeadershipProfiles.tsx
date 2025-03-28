"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { LeaderType } from "@/types";
import { useChorus } from "@/contexts/ChorusContext";
import useChorusStyles from "@/hooks/useChorusStyles";

interface LeadershipProfilesProps {
  leaders: LeaderType[];
  type: 'directors' | 'board';
}

export default function LeadershipProfiles({ leaders: allLeaders, type }: LeadershipProfilesProps) {
  const { selectedChorus } = useChorus();
  const { primaryTextClass } = useChorusStyles();
  const [leaders, setLeaders] = useState<LeaderType[]>(allLeaders);

  useEffect(() => {
    // If it's the board members, they remain the same regardless of chorus selection
    if (type === 'board') {
      setLeaders(allLeaders);
      return;
    }
    
    // For directors, filter based on selected chorus
    if (selectedChorus) {
      const filtered = allLeaders.filter(
        leader => leader.chorus === selectedChorus || leader.chorus === 'both'
      );
      setLeaders(filtered);
    } else {
      setLeaders(allLeaders);
    }
  }, [allLeaders, selectedChorus, type]);

  // Get the appropriate title based on the selected chorus and leadership type
  const getTitle = () => {
    if (type === 'directors') {
      if (selectedChorus === 'harmony') {
        return "Parkside Harmony Directors";
      } else if (selectedChorus === 'melody') {
        return "Parkside Melody Directors";
      }
      return "Music Directors";
    } else {
      return "Board Members";
    }
  };

  if (leaders.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">{getTitle()}</h2>
        <p className="text-lg text-gray-600">
          No leadership information available at this time.
          Please check back soon!
        </p>
      </div>
    );
  }
  
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{getTitle()}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {leaders.map((leader, index) => (
          <motion.div
            key={leader.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-square">
              <Image
                src={leader.image}
                alt={leader.name}
                fill
                className="object-cover"
              />
              {type === 'directors' && leader.chorus !== 'both' && leader.chorus !== undefined && (
                <div className="absolute top-3 right-3 bg-white text-sm font-medium py-1 px-2 rounded-md shadow-sm">
                  {leader.chorus === 'harmony' ? 'Harmony' : 'Melody'}
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800">{leader.name}</h3>
              <p className={`font-medium mb-4 ${primaryTextClass}`}>{leader.role}</p>
              <p className="text-gray-600 line-clamp-4">{leader.bio}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 