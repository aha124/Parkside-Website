"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ChorusType = "harmony" | "melody" | "voices";

interface ChorusContextType {
  chorus: ChorusType;
  setChorus: (chorus: ChorusType) => void;
  chorusLabel: string;
}

const ChorusContext = createContext<ChorusContextType | undefined>(undefined);

const CHORUS_COOKIE_NAME = "parkside_chorus";

function getChorusLabel(chorus: ChorusType): string {
  switch (chorus) {
    case "harmony":
      return "Parkside Harmony";
    case "melody":
      return "Parkside Melody";
    case "voices":
    default:
      return "Parkside Voices";
  }
}

export function ChorusProvider({ children }: { children: ReactNode }) {
  const [chorus, setChorusState] = useState<ChorusType>("voices");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load chorus from cookie on mount
  useEffect(() => {
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
      return null;
    };

    const savedChorus = getCookie(CHORUS_COOKIE_NAME) as ChorusType | null;
    if (savedChorus && ["harmony", "melody", "voices"].includes(savedChorus)) {
      setChorusState(savedChorus);
    }
    setIsLoaded(true);
  }, []);

  const setChorus = (newChorus: ChorusType) => {
    setChorusState(newChorus);
    // Save to cookie (expires in 30 days)
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    document.cookie = `${CHORUS_COOKIE_NAME}=${newChorus}; expires=${expires.toUTCString()}; path=/`;
  };

  // Don't render children until we've loaded the chorus from cookie
  // This prevents flash of wrong content
  if (!isLoaded) {
    return null;
  }

  return (
    <ChorusContext.Provider
      value={{
        chorus,
        setChorus,
        chorusLabel: getChorusLabel(chorus),
      }}
    >
      {children}
    </ChorusContext.Provider>
  );
}

export function useChorus() {
  const context = useContext(ChorusContext);
  if (context === undefined) {
    throw new Error("useChorus must be used within a ChorusProvider");
  }
  return context;
}

// Helper to check if content should be shown for current chorus
export function shouldShowForChorus(
  contentChorus: ChorusType | string | undefined,
  selectedChorus: ChorusType
): boolean {
  // If no chorus specified on content, show it for all
  if (!contentChorus) return true;

  // If user selected "voices", show everything
  if (selectedChorus === "voices") return true;

  // If content is tagged "voices", show it for all chorus selections
  if (contentChorus === "voices") return true;

  // Otherwise, only show if it matches the selected chorus
  return contentChorus === selectedChorus;
}
