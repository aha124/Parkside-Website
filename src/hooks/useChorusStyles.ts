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
  const secondaryBgClass = 'bg-gray-200';
  
  if (selectedChorus === 'harmony') {
    primaryColor = chorusContent.harmony.primaryColor;
    primaryColorHover = '#1D4ED8'; // blue-700
    primaryColorLight = '#EFF6FF'; // blue-50
    primaryTextClass = 'text-blue-600';
    primaryBgClass = 'bg-blue-600';
  } else if (selectedChorus === 'melody') {
    primaryColor = chorusContent.melody.primaryColor;
    primaryColorHover = '#047857'; // emerald-700
    primaryColorLight = '#ECFDF5'; // emerald-50
    primaryTextClass = 'text-emerald-600';
    primaryBgClass = 'bg-emerald-600';
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