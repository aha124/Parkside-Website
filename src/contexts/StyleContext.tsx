'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useChorus } from './ChorusContext';

interface StyleContextType {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

const defaultStyles: StyleContextType = {
  primaryColor: '#6366F1', // Default indigo color
  secondaryColor: '#E0E7FF',
  accentColor: '#4F46E5',
};

const StyleContext = createContext<StyleContextType>(defaultStyles);

export function StyleProvider({ children }: { children: React.ReactNode }) {
  const { selectedChorus } = useChorus();
  const [styles, setStyles] = useState<StyleContextType>(defaultStyles);

  useEffect(() => {
    if (selectedChorus === 'harmony') {
      setStyles({
        primaryColor: '#4F46E5', // Indigo (Harmony's color)
        secondaryColor: '#E0E7FF',
        accentColor: '#4338CA',
      });
    } else if (selectedChorus === 'melody') {
      setStyles({
        primaryColor: '#EC4899', // Pink (Melody's color)
        secondaryColor: '#FCE7F3',
        accentColor: '#DB2777',
      });
    } else {
      // Default to both/combined colors
      setStyles(defaultStyles);
    }
  }, [selectedChorus]);

  return (
    <StyleContext.Provider value={styles}>
      {children}
    </StyleContext.Provider>
  );
}

export function useChorusStyles() {
  return useContext(StyleContext);
} 