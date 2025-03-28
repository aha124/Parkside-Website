"use client";

import { ReactNode } from 'react';
import { useChorus } from "@/contexts/ChorusContext";
import chorusContent from "@/data/chorusContent";

interface ChorusContentProps {
  harmony: ReactNode;
  melody: ReactNode;
  both?: ReactNode;
}

/**
 * ChorusContent component displays different content based on the selected chorus.
 * 
 * @param harmony - Content to display when Harmony chorus is selected
 * @param melody - Content to display when Melody chorus is selected
 * @param both - Content to display when no specific chorus is selected (optional)
 */
export default function ChorusContent({ harmony, melody, both }: ChorusContentProps) {
  const { selectedChorus } = useChorus();

  if (selectedChorus === 'harmony') {
    return <>{harmony}</>;
  } else if (selectedChorus === 'melody') {
    return <>{melody}</>;
  } else {
    // If no specific chorus is selected, show the combined content or fall back to Harmony content
    return <>{both || harmony}</>;
  }
} 