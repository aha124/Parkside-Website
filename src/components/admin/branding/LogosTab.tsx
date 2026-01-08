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

interface LogosTabProps {
  settings: SiteSettings | null;
  onImageSelect: (type: "logo", chorus: ChorusKey) => void;
}

export default function LogosTab({ settings, onImageSelect }: LogosTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Chorus Logos</h2>
        <p className="text-sm text-gray-500">
          Upload logos for each chorus. These appear in the header and throughout the site.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {choruses.map((chorus) => (
          <div key={chorus} className="bg-white rounded-lg border border-gray-200 p-4">
            <label className={`block text-sm font-medium mb-3 ${chorusInfo[chorus].color}`}>
              {chorusInfo[chorus].name} Logo
            </label>
            <button
              onClick={() => onImageSelect("logo", chorus)}
              className={`w-full border-2 border-dashed rounded-lg p-6 text-center ${chorusInfo[chorus].bgColor} border-gray-300 hover:border-gray-400 hover:bg-opacity-70 transition-all cursor-pointer group`}
            >
              {settings?.logos?.[chorus] ? (
                <div className="relative h-24 w-24 mx-auto mb-3 bg-white rounded-lg p-2">
                  <Image
                    src={settings.logos[chorus]!}
                    alt={`${chorusInfo[chorus].name} logo`}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="h-24 w-24 mx-auto mb-3 bg-white/50 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-gray-400" />
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
  );
}
