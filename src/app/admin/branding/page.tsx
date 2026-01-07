"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Upload, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import type { SiteSettings, PageKey, ChorusKey } from "@/types/admin";

// Utility to compress images before upload (max 2MB, max 2000px dimension)
async function compressImage(file: File, maxSizeMB = 2, maxDimension = 2000): Promise<File> {
  return new Promise((resolve, reject) => {
    // If file is already small enough, return as-is
    if (file.size <= maxSizeMB * 1024 * 1024) {
      resolve(file);
      return;
    }

    const img = document.createElement("img");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      let { width, height } = img;

      // Scale down if too large
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        } else {
          width = (width / height) * maxDimension;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      // Try different quality levels to get under size limit
      const tryCompress = (quality: number): void => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image"));
              return;
            }

            if (blob.size <= maxSizeMB * 1024 * 1024 || quality <= 0.1) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              // Try again with lower quality
              tryCompress(quality - 0.1);
            }
          },
          "image/jpeg",
          quality
        );
      };

      tryCompress(0.9);
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

const chorusInfo: Record<ChorusKey, { name: string; color: string; bgColor: string }> = {
  harmony: { name: "Harmony", color: "text-indigo-700", bgColor: "bg-indigo-100" },
  melody: { name: "Melody", color: "text-amber-700", bgColor: "bg-amber-100" },
  voices: { name: "Voices", color: "text-purple-700", bgColor: "bg-purple-100" },
};

const pageInfo: Record<PageKey, { name: string; description: string }> = {
  home: { name: "Home", description: "Main landing page slideshow/hero" },
  about: { name: "About", description: "About us page banner" },
  join: { name: "Join", description: "Join/membership page banner" },
  media: { name: "Media", description: "Media gallery page banner" },
  donate: { name: "Donate", description: "Donation page banner" },
  events: { name: "Events", description: "Events listing page banner" },
  gear: { name: "Purchase Gear", description: "Shop/merchandise page banner" },
  contact: { name: "Contact", description: "Contact us page banner" },
};

const pages: PageKey[] = ["home", "about", "join", "media", "donate", "events", "gear", "contact"];
const choruses: ChorusKey[] = ["harmony", "melody", "voices"];

export default function BrandingPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ logos: true, home: true });
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/site-settings");
      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      setMessage({ type: "error", text: "Failed to load settings" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    type: "logo" | "banner",
    chorus: ChorusKey,
    page?: PageKey,
    file?: File
  ) => {
    if (!file) return;

    const uploadKey = type === "logo" ? `logo-${chorus}` : `banner-${page}-${chorus}`;
    setUploading(uploadKey);
    setMessage(null);

    try {
      // Compress image if too large (logos: 1MB max, banners: 2MB max)
      const maxSize = type === "logo" ? 1 : 2;
      const compressedFile = await compressImage(file, maxSize);

      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("name", type === "logo" ? `${chorus}-logo` : `${page}-${chorus}-banner`);
      formData.append("category", type === "logo" ? "other" : "banner");
      formData.append("alt", type === "logo" ? `${chorusInfo[chorus].name} logo` : `${pageInfo[page!].name} banner for ${chorusInfo[chorus].name}`);
      formData.append("chorus", chorus);

      const uploadResponse = await fetch("/api/admin/images/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      if (!uploadData.success) {
        throw new Error(uploadData.error || "Upload failed");
      }

      // Update settings with new URL
      let newSettings: SiteSettings;
      if (type === "logo") {
        newSettings = {
          ...settings!,
          logos: {
            ...settings!.logos,
            [chorus]: uploadData.data.url,
          },
        };
      } else {
        newSettings = {
          ...settings!,
          pageBanners: {
            ...settings!.pageBanners,
            [page!]: {
              ...settings!.pageBanners[page!],
              [chorus]: uploadData.data.url,
            },
          },
        };
      }
      setSettings(newSettings);

      // Save to server
      await saveSettings(newSettings);
      setMessage({ type: "success", text: "Image updated successfully!" });
    } catch (error) {
      console.error("Error uploading:", error);
      setMessage({ type: "error", text: "Failed to upload image" });
    } finally {
      setUploading(null);
    }
  };

  const saveSettings = async (settingsToSave: SiteSettings) => {
    try {
      const response = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsToSave),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage({ type: "error", text: "Failed to save settings" });
    }
  };

  const triggerFileInput = (key: string) => {
    fileInputRefs.current[key]?.click();
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Branding</h1>
        <p className="text-gray-600 mt-1">
          Manage logos and page banners for each chorus. Each page can have different images depending on which chorus the visitor selected.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Logos Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <button
          onClick={() => toggleSection("logos")}
          className="w-full px-6 py-4 bg-gray-900 text-white flex items-center justify-between"
        >
          <h2 className="font-semibold text-lg">Chorus Logos</h2>
          {expandedSections.logos ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {expandedSections.logos && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {choruses.map((chorus) => (
              <div key={chorus}>
                <label className={`block text-sm font-medium mb-2 ${chorusInfo[chorus].color}`}>
                  {chorusInfo[chorus].name} Logo
                </label>
                <div className={`border-2 border-dashed rounded-lg p-4 text-center ${chorusInfo[chorus].bgColor} border-gray-300`}>
                  {settings?.logos?.[chorus] ? (
                    <div className="relative h-20 w-20 mx-auto mb-2">
                      <Image
                        src={settings.logos[chorus]!}
                        alt={`${chorusInfo[chorus].name} logo`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-20 w-20 mx-auto mb-2 bg-white/50 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No logo</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={(el) => { fileInputRefs.current[`logo-${chorus}`] = el; }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload("logo", chorus, undefined, file);
                    }}
                  />
                  <button
                    onClick={() => triggerFileInput(`logo-${chorus}`)}
                    disabled={uploading === `logo-${chorus}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-white hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50 border border-gray-300"
                  >
                    {uploading === `logo-${chorus}` ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    Upload
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Page Banners Sections */}
      {pages.map((page) => (
        <div key={page} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection(page)}
            className="w-full px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <div className="text-left">
              <h2 className="font-semibold text-gray-900">{pageInfo[page].name} Page</h2>
              <p className="text-sm text-gray-500">{pageInfo[page].description}</p>
            </div>
            {expandedSections[page] ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
          </button>

          {expandedSections[page] && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {choruses.map((chorus) => (
                <div key={chorus}>
                  <label className={`block text-sm font-medium mb-2 ${chorusInfo[chorus].color}`}>
                    {chorusInfo[chorus].name} Banner
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-3 text-center ${chorusInfo[chorus].bgColor} border-gray-300`}>
                    {settings?.pageBanners?.[page]?.[chorus] ? (
                      <div className="relative h-24 w-full mb-2">
                        <Image
                          src={settings.pageBanners[page][chorus]!}
                          alt={`${pageInfo[page].name} ${chorusInfo[chorus].name} banner`}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="h-24 w-full mb-2 bg-white/50 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No banner</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={(el) => { fileInputRefs.current[`banner-${page}-${chorus}`] = el; }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload("banner", chorus, page, file);
                      }}
                    />
                    <button
                      onClick={() => triggerFileInput(`banner-${page}-${chorus}`)}
                      disabled={uploading === `banner-${page}-${chorus}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-white hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50 border border-gray-300"
                    >
                      {uploading === `banner-${page}-${chorus}` ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      Upload
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {settings?.updatedAt && (
        <p className="text-sm text-gray-500">
          Last updated: {new Date(settings.updatedAt).toLocaleString()}
          {settings.updatedBy && ` by ${settings.updatedBy}`}
        </p>
      )}
    </div>
  );
}
