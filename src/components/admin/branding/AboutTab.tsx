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

interface AboutTabProps {
  settings: SiteSettings | null;
  pageContent: PageContent;
  onImageSelect: (type: "banner" | "aboutStory", chorus: ChorusKey, page: "about") => void;
  onContentSave: (pageKey: "about", content: PageContent) => Promise<void>;
  saving: boolean;
}

export default function AboutTab({
  settings,
  pageContent,
  onImageSelect,
  onContentSave,
  saving,
}: AboutTabProps) {
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
    await onContentSave("about", localContent);
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
          <h2 className="text-lg font-semibold text-gray-900">About Page</h2>
          <p className="text-sm text-gray-500">
            Configure the About page banner and &quot;Our Story&quot; section content
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

      {/* Page Banner Images */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-md font-medium text-gray-900 mb-2">Page Banner Images</h3>
        <p className="text-sm text-gray-500 mb-4">
          Hero banner images for the About page (shown based on chorus selection)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {choruses.map((chorus) => (
            <div key={chorus}>
              <label className={`block text-sm font-medium mb-2 ${chorusInfo[chorus].color}`}>
                {chorusInfo[chorus].name} Banner
              </label>
              <button
                onClick={() => onImageSelect("banner", chorus, "about")}
                className={`w-full border-2 border-dashed rounded-lg p-2 text-center ${chorusInfo[chorus].bgColor} border-gray-300 hover:border-gray-400 hover:bg-opacity-70 transition-all cursor-pointer group`}
              >
                {settings?.pageBanners?.about?.[chorus] ? (
                  <div className="relative h-20 w-full mb-1 rounded overflow-hidden">
                    <Image
                      src={settings.pageBanners.about[chorus]!}
                      alt={`About ${chorusInfo[chorus].name} banner`}
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
                  {settings?.pageBanners?.about?.[chorus] ? "Change" : "Select"}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Our Story Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-md font-medium text-gray-900 mb-2">&quot;Our Story&quot; Section</h3>
        <p className="text-sm text-gray-500 mb-4">
          Configure the image and text content for the &quot;Our Story&quot; section. Each chorus has its own image and story text that displays when visitors select that chorus.
        </p>
        <div className="space-y-6">
          {choruses.map((chorus) => (
            <div key={chorus} className={`p-4 rounded-lg ${chorusInfo[chorus].bgColor}`}>
              <h4 className={`text-sm font-semibold mb-3 ${chorusInfo[chorus].color}`}>
                {chorusInfo[chorus].name}
              </h4>
              <div className="flex gap-4">
                {/* Story Image picker */}
                <div className="flex-shrink-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Story Image
                  </label>
                  <button
                    onClick={() => onImageSelect("aboutStory", chorus, "about")}
                    className="w-32 border-2 border-dashed rounded-lg p-2 text-center bg-white/50 border-gray-300 hover:border-gray-400 hover:bg-white/70 transition-all cursor-pointer group"
                  >
                    {settings?.aboutStoryImages?.[chorus] ? (
                      <div className="relative h-24 w-full mb-1 rounded overflow-hidden">
                        <Image
                          src={settings.aboutStoryImages[chorus]!}
                          alt={`${chorusInfo[chorus].name} story image`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-24 w-full mb-1 bg-gray-100 rounded flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <span className="text-xs text-gray-600 group-hover:text-gray-900">
                      {settings?.aboutStoryImages?.[chorus] ? "Change" : "Select"}
                    </span>
                  </button>
                </div>
                {/* Story text content */}
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Our Story Text
                  </label>
                  <textarea
                    value={localContent[`story_${chorus}`] || ""}
                    onChange={(e) => handleFieldChange(`story_${chorus}`, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                    rows={5}
                    placeholder={`Story text for ${chorusInfo[chorus].name}. Use blank lines to separate paragraphs.`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info about non-editable sections */}
      <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-1">Non-editable sections:</p>
        <p>
          The following sections are consistent across all choruses and are not editable here:
          Mission & Values, Our Achievements, Our Commitment to Inclusion, and the &quot;Join&quot; CTA section (which dynamically updates based on selected chorus).
        </p>
      </div>
    </div>
  );
}
