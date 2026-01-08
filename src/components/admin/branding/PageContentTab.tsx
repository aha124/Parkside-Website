"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ImageIcon, Save, RotateCcw } from "lucide-react";
import type { SiteSettings, ChorusKey, PageKey, PageContent } from "@/types/admin";
import { PAGE_CONTENT_SCHEMA } from "@/types/admin";

const chorusInfo: Record<ChorusKey, { name: string; color: string; bgColor: string }> = {
  harmony: { name: "Harmony", color: "text-indigo-700", bgColor: "bg-indigo-100" },
  melody: { name: "Melody", color: "text-amber-700", bgColor: "bg-amber-100" },
  voices: { name: "Voices", color: "text-purple-700", bgColor: "bg-purple-100" },
};

const choruses: ChorusKey[] = ["harmony", "melody", "voices"];

interface PageContentTabProps {
  pageKey: PageKey;
  pageName: string;
  pageDescription: string;
  settings: SiteSettings | null;
  pageContent: PageContent;
  onImageSelect: (type: "banner", chorus: ChorusKey, page: PageKey) => void;
  onContentSave: (pageKey: PageKey, content: PageContent) => Promise<void>;
  saving: boolean;
}

export default function PageContentTab({
  pageKey,
  pageName,
  pageDescription,
  settings,
  pageContent,
  onImageSelect,
  onContentSave,
  saving,
}: PageContentTabProps) {
  const [localContent, setLocalContent] = useState<PageContent>(pageContent);
  const [hasChanges, setHasChanges] = useState(false);

  // Get field schema for this page
  const schema = PAGE_CONTENT_SCHEMA[pageKey];

  useEffect(() => {
    setLocalContent(pageContent);
    setHasChanges(false);
  }, [pageContent]);

  const handleFieldChange = (key: string, value: string) => {
    setLocalContent((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    await onContentSave(pageKey, localContent);
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
          <h2 className="text-lg font-semibold text-gray-900">{pageName} Page</h2>
          <p className="text-sm text-gray-500">{pageDescription}</p>
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

      {/* Banner Images Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-md font-medium text-gray-900 mb-4">Page Banner Images</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {choruses.map((chorus) => (
            <div key={chorus}>
              <label className={`block text-sm font-medium mb-2 ${chorusInfo[chorus].color}`}>
                {chorusInfo[chorus].name} Banner
              </label>
              <button
                onClick={() => onImageSelect("banner", chorus, pageKey)}
                className={`w-full border-2 border-dashed rounded-lg p-2 text-center ${chorusInfo[chorus].bgColor} border-gray-300 hover:border-gray-400 hover:bg-opacity-70 transition-all cursor-pointer group`}
              >
                {settings?.pageBanners?.[pageKey]?.[chorus] ? (
                  <div className="relative h-20 w-full mb-1 rounded overflow-hidden">
                    <Image
                      src={settings.pageBanners[pageKey][chorus]!}
                      alt={`${pageName} ${chorusInfo[chorus].name} banner`}
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
                  {settings?.pageBanners?.[pageKey]?.[chorus] ? "Change" : "Select"}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Content Fields Section */}
      {schema && schema.fields.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-md font-medium text-gray-900 mb-4">Page Content</h3>
          <div className="space-y-4">
            {schema.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    value={localContent[field.key] || ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    rows={3}
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                  />
                ) : (
                  <input
                    type="text"
                    value={localContent[field.key] || ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
