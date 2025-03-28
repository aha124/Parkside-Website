"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ChorusType } from '@/data/chorusContent';

interface ChorusContextType {
  selectedChorus: ChorusType;
  setChorus: (chorus: ChorusType) => void;
  clearChorus: () => void;
}

const ChorusContext = createContext<ChorusContextType | undefined>(undefined);

export const ChorusProvider = ({ children }: { children: ReactNode }) => {
  const [selectedChorus, setSelectedChorus] = useState<ChorusType>(null);

  // Load saved chorus selection from localStorage on initial render
  useEffect(() => {
    const savedChorus = localStorage.getItem('selectedChorus');
    if (savedChorus === 'harmony' || savedChorus === 'melody') {
      setSelectedChorus(savedChorus);
    }
  }, []);

  // Update localStorage when chorus selection changes
  useEffect(() => {
    if (selectedChorus) {
      localStorage.setItem('selectedChorus', selectedChorus);
    } else {
      localStorage.removeItem('selectedChorus');
    }
  }, [selectedChorus]);

  const setChorus = (chorus: ChorusType) => {
    setSelectedChorus(chorus);
  };

  const clearChorus = () => {
    setSelectedChorus(null);
  };

  return (
    <ChorusContext.Provider value={{ selectedChorus, setChorus, clearChorus }}>
      {children}
    </ChorusContext.Provider>
  );
};

export const useChorus = (): ChorusContextType => {
  const context = useContext(ChorusContext);
  if (context === undefined) {
    throw new Error('useChorus must be used within a ChorusProvider');
  }
  return context;
}; 