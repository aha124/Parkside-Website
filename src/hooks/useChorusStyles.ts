"use client";

import { useChorus } from "@/contexts/ChorusContext";
import chorusContent from "@/data/chorusContent";

interface ChorusStyles {
  primaryColor: string;
  primaryColorHover: string;
  primaryColorLight: string;
  buttonStyle: React.CSSProperties;
  secondaryButtonStyle: React.CSSProperties;
  primaryButtonClasses: string;
  secondaryButtonClasses: string;
  primaryTextClass: string;
  primaryBgClass: string;
  secondaryBgClass: string;
}

export default function useChorusStyles(): ChorusStyles {
  const { selectedChorus } = useChorus();
  
  // Default styles (combined view)
  let primaryColor = '#4F46E5'; // indigo-600
  let primaryColorHover = '#4338CA'; // indigo-700
  let primaryColorLight = '#EEF2FF'; // indigo-50
  let primaryTextClass = 'text-indigo-600';
  let primaryBgClass = 'bg-indigo-600';
  let secondaryBgClass = 'bg-gray-200';
  
  if (selectedChorus === 'harmony') {
    primaryColor = chorusContent.harmony.primaryColor;
    primaryColorHover = '#1E3A8A'; // indigo-900
    primaryColorLight = '#EEF2FF'; // indigo-50
    primaryTextClass = 'text-indigo-800';
    primaryBgClass = 'bg-indigo-800';
  } else if (selectedChorus === 'melody') {
    primaryColor = chorusContent.melody.primaryColor;
    primaryColorHover = '#9D174D'; // pink-800
    primaryColorLight = '#FDF2F8'; // pink-50
    primaryTextClass = 'text-pink-700';
    primaryBgClass = 'bg-pink-700';
  }
  
  // Inline styles for buttons
  const buttonStyle = {
    backgroundColor: primaryColor,
    color: 'white',
  };
  
  const secondaryButtonStyle = {
    backgroundColor: '#E5E7EB', // gray-200
    color: '#1F2937', // gray-800
  };
  
  // For cases where we need to use classes
  const primaryButtonClasses = `${primaryBgClass} px-6 py-3 text-white font-medium rounded-md transition-colors`;
  const secondaryButtonClasses = "px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors";
  
  return {
    primaryColor,
    primaryColorHover,
    primaryColorLight,
    buttonStyle,
    secondaryButtonStyle,
    primaryButtonClasses,
    secondaryButtonClasses,
    primaryTextClass,
    primaryBgClass,
    secondaryBgClass
  };
} 