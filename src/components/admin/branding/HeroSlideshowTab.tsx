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

interface HeroSlideshowTabProps {
  settings: SiteSettings | null;
  onImageSelect: (type: "heroSlide", chorus: ChorusKey) => void;
}

export default function HeroSlideshowTab({ settings, onImageSelect }: HeroSlideshowTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Hero Slideshow - First Slide</h2>
        <p className="text-sm text-gray-500">
          Background image for the main hero slideshow on the home page. Changes based on chorus selection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {choruses.map((chorus) => (
          <div key={chorus} className="bg-white rounded-lg border border-gray-200 p-4">
            <label className={`block text-sm font-medium mb-3 ${chorusInfo[chorus].color}`}>
              {chorusInfo[chorus].name} Hero Background
            </label>
            <button
              onClick={() => onImageSelect("heroSlide", chorus)}
              className={`w-full border-2 border-dashed rounded-lg p-3 text-center ${chorusInfo[chorus].bgColor} border-gray-300 hover:border-gray-400 hover:bg-opacity-70 transition-all cursor-pointer group`}
            >
              {settings?.heroSlideBackground?.[chorus] ? (
                <div className="relative h-32 w-full mb-2 rounded overflow-hidden">
                  <Image
                    src={settings.heroSlideBackground[chorus]!}
                    alt={`${chorusInfo[chorus].name} hero slideshow background`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-32 w-full mb-2 bg-white/50 rounded flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-gray-400" />
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
  );
}
