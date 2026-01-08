"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ImageIcon, Save, RotateCcw } from "lucide-react";
import type { SiteSettings, ChorusKey, PageContent } from "@/types/admin";

const chorusInfo: Record<ChorusKey, { name: string; color: string; bgColor: string }> = {
  harmony: { name: "Harmony", color: "text-indigo-700", bgColor: "bg-indigo-100" },
  melody: { name: "Melody", color: "text-amber-700", bgColor: "bg-amber-100" },
  voices: { name: "Voices", color: "text-purple-700", bgColor: "bg-purple-100" },
};

const choruses: ChorusKey[] = ["harmony", "melody", "voices"];

interface HomeTabProps {
  settings: SiteSettings | null;
  pageContent: PageContent;
  onImageSelect: (type: "banner", chorus: ChorusKey, page: "home") => void;
  onContentSave: (pageKey: "home", content: PageContent) => Promise<void>;
  saving: boolean;
}

export default function HomeTab({
  settings,
  pageContent,
  onImageSelect,
  onContentSave,
  saving,
}: HomeTabProps) {
  const [localContent, setLocalContent] = useState<PageContent>(pageContent);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalContent(pageContent);
    setHasChanges(false);
  }, [pageContent]);

  const handleFieldChange = (key: string, value: string) => {
    setLocalContent((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    await onContentSave("home", localContent);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalContent(pageContent);
    setHasChanges(false);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Home Page</h2>
          <p className="text-sm text-gray-500">
            Configure the home page hero slideshow and &quot;Our Choruses&quot; section
          </p>
        </div>
        {hasChanges && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
              disabled={saving}
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
              disabled={saving}
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {/* Hero Slide Banner Images */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-md font-medium text-gray-900 mb-2">Hero Slideshow Banners</h3>
        <p className="text-sm text-gray-500 mb-4">
          Background images for the first slide of the hero slideshow (per chorus selection)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {choruses.map((chorus) => (
            <div key={chorus}>
              <label className={`block text-sm font-medium mb-2 ${chorusInfo[chorus].color}`}>
                {chorusInfo[chorus].name} Banner
              </label>
              <button
                onClick={() => onImageSelect("banner", chorus, "home")}
                className={`w-full border-2 border-dashed rounded-lg p-2 text-center ${chorusInfo[chorus].bgColor} border-gray-300 hover:border-gray-400 hover:bg-opacity-70 transition-all cursor-pointer group`}
              >
                {settings?.pageBanners?.home?.[chorus] ? (
                  <div className="relative h-20 w-full mb-1 rounded overflow-hidden">
                    <Image
                      src={settings.pageBanners.home[chorus]!}
                      alt={`Home ${chorusInfo[chorus].name} banner`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-20 w-full mb-1 bg-white/50 rounded flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <span className="text-xs text-gray-600 group-hover:text-gray-900">
                  {settings?.pageBanners?.home?.[chorus] ? "Change" : "Select"}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Slide Descriptions (per chorus) */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-md font-medium text-gray-900 mb-2">Hero Slide Descriptions</h3>
        <p className="text-sm text-gray-500 mb-4">
          The description text that appears on the first slide below the chorus name
        </p>
        <div className="space-y-4">
          {choruses.map((chorus) => (
            <div key={chorus}>
              <label className={`block text-sm font-medium mb-1 ${chorusInfo[chorus].color}`}>
                {chorusInfo[chorus].name} Description
              </label>
              <textarea
                value={localContent[`heroDescription_${chorus}`] || ""}
                onChange={(e) => handleFieldChange(`heroDescription_${chorus}`, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                rows={2}
                placeholder={`Description for ${chorusInfo[chorus].name} on the hero slide...`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Our Choruses Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-md font-medium text-gray-900 mb-2">&quot;Our Choruses&quot; Section</h3>
        <p className="text-sm text-gray-500 mb-4">
          Edit the descriptions that appear in the &quot;Our Choruses&quot; section on the home page.
          Each chorus card has a &quot;Learn More&quot; button that links to the About page.
        </p>
        <div className="space-y-4">
          {choruses.map((chorus) => (
            <div key={chorus} className={`p-4 rounded-lg ${chorusInfo[chorus].bgColor}`}>
              <label className={`block text-sm font-medium mb-1 ${chorusInfo[chorus].color}`}>
                {chorusInfo[chorus].name} - Card Description
              </label>
              <textarea
                value={localContent[`chorusCard_${chorus}`] || ""}
                onChange={(e) => handleFieldChange(`chorusCard_${chorus}`, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                rows={3}
                placeholder={`Description for ${chorusInfo[chorus].name} chorus card...`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
