"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { SiteSettings, ChorusKey } from "@/types/admin";

const chorusInfo: Record<ChorusKey, { name: string; color: string; bgColor: string }> = {
  harmony: { name: "Harmony", color: "text-indigo-700", bgColor: "bg-indigo-100" },
  melody: { name: "Melody", color: "text-amber-700", bgColor: "bg-amber-100" },
  voices: { name: "Voices", color: "text-purple-700", bgColor: "bg-purple-100" },
};

const choruses: ChorusKey[] = ["harmony", "melody", "voices"];

interface GeneralTabProps {
  settings: SiteSettings | null;
  onImageSelect: (type: "logo" | "splash" | "heroSlide", chorus: ChorusKey) => void;
}

export default function GeneralTab({ settings, onImageSelect }: GeneralTabProps) {
  return (
    <div className="space-y-8">
      {/* Chorus Logos Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Chorus Logos</h3>
          <p className="text-sm text-gray-500">
            Logos displayed in the header and throughout the site
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {choruses.map((chorus) => (
            <div key={chorus}>
              <label className={`block text-sm font-medium mb-2 ${chorusInfo[chorus].color}`}>
                {chorusInfo[chorus].name} Logo
              </label>
              <button
                onClick={() => onImageSelect("logo", chorus)}
                className={`w-full border-2 border-dashed rounded-lg p-4 text-center ${chorusInfo[chorus].bgColor} border-gray-300 hover:border-gray-400 hover:bg-opacity-70 transition-all cursor-pointer group`}
              >
                {settings?.logos?.[chorus] ? (
                  <div className="relative h-20 w-20 mx-auto mb-2 bg-white rounded-lg p-2">
                    <Image
                      src={settings.logos[chorus]!}
                      alt={`${chorusInfo[chorus].name} logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-20 w-20 mx-auto mb-2 bg-white/50 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <span className="text-sm text-gray-600 group-hover:text-gray-900">
                  {settings?.logos?.[chorus] ? "Change Logo" : "Select Logo"}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Splash Page Backgrounds Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Splash Page Backgrounds</h3>
          <p className="text-sm text-gray-500">
            Background images for the landing page carousel (mobile) and split view (desktop)
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {choruses.map((chorus) => (
            <div key={chorus}>
              <label className={`block text-sm font-medium mb-2 ${chorusInfo[chorus].color}`}>
                {chorusInfo[chorus].name} Background
              </label>
              <button
                onClick={() => onImageSelect("splash", chorus)}
                className={`w-full border-2 border-dashed rounded-lg p-3 text-center ${chorusInfo[chorus].bgColor} border-gray-300 hover:border-gray-400 hover:bg-opacity-70 transition-all cursor-pointer group`}
              >
                {settings?.splashBackgrounds?.[chorus] ? (
                  <div className="relative h-24 w-full mb-2 rounded overflow-hidden">
                    <Image
                      src={settings.splashBackgrounds[chorus]!}
                      alt={`${chorusInfo[chorus].name} splash background`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-24 w-full mb-2 bg-white/50 rounded flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <span className="text-sm text-gray-600 group-hover:text-gray-900">
                  {settings?.splashBackgrounds?.[chorus] ? "Change Image" : "Select Image"}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Slideshow First Slide Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Hero Slideshow - First Slide</h3>
          <p className="text-sm text-gray-500">
            Background image for the first slide of the home page hero (changes based on chorus selection)
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {choruses.map((chorus) => (
            <div key={chorus}>
              <label className={`block text-sm font-medium mb-2 ${chorusInfo[chorus].color}`}>
                {chorusInfo[chorus].name} Hero Background
              </label>
              <button
                onClick={() => onImageSelect("heroSlide", chorus)}
                className={`w-full border-2 border-dashed rounded-lg p-3 text-center ${chorusInfo[chorus].bgColor} border-gray-300 hover:border-gray-400 hover:bg-opacity-70 transition-all cursor-pointer group`}
              >
                {settings?.heroSlideBackground?.[chorus] ? (
                  <div className="relative h-24 w-full mb-2 rounded overflow-hidden">
                    <Image
                      src={settings.heroSlideBackground[chorus]!}
                      alt={`${chorusInfo[chorus].name} hero slideshow background`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-24 w-full mb-2 bg-white/50 rounded flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <span className="text-sm text-gray-600 group-hover:text-gray-900">
                  {settings?.heroSlideBackground?.[chorus] ? "Change Image" : "Select Image"}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
