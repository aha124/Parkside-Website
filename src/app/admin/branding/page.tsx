"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ImageIcon, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import type { SiteSettings, PageKey, ChorusKey } from "@/types/admin";
import ImagePickerModal from "@/components/admin/ImagePickerModal";

// Utility to process images before upload
// - Adds white background to transparent PNGs (fixes black background issue)
// - Compresses and resizes if needed
async function processImage(
  file: File,
  options: {
    maxSizeMB?: number;
    maxDimension?: number;
    addWhiteBackground?: boolean;
  } = {}
): Promise<File> {
  const { maxSizeMB = 2, maxDimension = 2000, addWhiteBackground = false } = options;

  return new Promise((resolve, reject) => {
    const isPng = file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
    const needsProcessing = addWhiteBackground || file.size > maxSizeMB * 1024 * 1024;

    // If no processing needed and file is small enough, return as-is
    if (!needsProcessing && !isPng) {
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

      if (ctx) {
        // Add white background for transparent images (especially PNGs)
        if (addWhiteBackground || isPng) {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, width, height);
        }
        ctx.drawImage(img, 0, 0, width, height);
      }

      // Try different quality levels to get under size limit
      const tryCompress = (quality: number): void => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to process image"));
              return;
            }

            if (blob.size <= maxSizeMB * 1024 * 1024 || quality <= 0.1) {
              // Use PNG for logos (to maintain quality), JPEG for banners
              const outputType = addWhiteBackground ? "image/png" : "image/jpeg";
              const extension = addWhiteBackground ? ".png" : ".jpg";
              const fileName = file.name.replace(/\.[^/.]+$/, "") + extension;

              const processedFile = new File([blob], fileName, {
                type: outputType,
                lastModified: Date.now(),
              });
              resolve(processedFile);
            } else {
              // Try again with lower quality
              tryCompress(quality - 0.1);
            }
          },
          addWhiteBackground ? "image/png" : "image/jpeg",
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
  leadership: { name: "Leadership", description: "Leadership team page banner" },
};

const pages: PageKey[] = ["home", "about", "join", "media", "donate", "events", "gear", "contact", "leadership"];
const choruses: ChorusKey[] = ["harmony", "melody", "voices"];

// Types for image picker modal state
interface PickerState {
  isOpen: boolean;
  type: "logo" | "banner" | "splash" | "heroSlide";
  chorus: ChorusKey;
  page?: PageKey;
}

export default function BrandingPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ logos: true, splash: true });
  const [pickerState, setPickerState] = useState<PickerState | null>(null);

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

  const openPicker = (type: PickerState["type"], chorus: ChorusKey, page?: PageKey) => {
    setPickerState({ isOpen: true, type, chorus, page });
  };

  const closePicker = () => {
    setPickerState(null);
  };

  const handleImageSelect = async (imageUrl: string) => {
    if (!pickerState || !settings) return;

    const { type, chorus, page } = pickerState;
    setSaving(true);
    setMessage(null);

    try {
      let newSettings: SiteSettings;
      if (type === "logo") {
        newSettings = {
          ...settings,
          logos: {
            ...settings.logos,
            [chorus]: imageUrl,
          },
        };
      } else if (type === "splash") {
        newSettings = {
          ...settings,
          splashBackgrounds: {
            ...settings.splashBackgrounds,
            [chorus]: imageUrl,
          },
        };
      } else if (type === "heroSlide") {
        newSettings = {
          ...settings,
          heroSlideBackground: {
            ...settings.heroSlideBackground,
            [chorus]: imageUrl,
          },
        };
      } else {
        newSettings = {
          ...settings,
          pageBanners: {
            ...settings.pageBanners,
            [page!]: {
              ...settings.pageBanners[page!],
              [chorus]: imageUrl,
            },
          },
        };
      }

      setSettings(newSettings);
      await saveSettings(newSettings);
      setMessage({ type: "success", text: "Image updated successfully!" });
    } catch (error) {
      console.error("Error updating image:", error);
      setMessage({ type: "error", text: "Failed to update image" });
    } finally {
      setSaving(false);
      closePicker();
    }
  };

  const saveSettings = async (settingsToSave: SiteSettings) => {
    const response = await fetch("/api/admin/site-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settingsToSave),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Get upload config for the image picker modal
  const getUploadConfig = () => {
    if (!pickerState) return undefined;
    const { type, chorus, page } = pickerState;

    const nameMap = {
      logo: `${chorus}-logo`,
      splash: `${chorus}-splash-bg`,
      heroSlide: `${chorus}-hero-slide-bg`,
      banner: `${page}-${chorus}-banner`,
    };
    const altMap = {
      logo: `${chorusInfo[chorus].name} logo`,
      splash: `${chorusInfo[chorus].name} splash background`,
      heroSlide: `${chorusInfo[chorus].name} hero slideshow background`,
      banner: page ? `${pageInfo[page].name} banner for ${chorusInfo[chorus].name}` : "",
    };
    const categoryMap = {
      logo: "other",
      splash: "banner",
      heroSlide: "slideshow",
      banner: "banner",
    };

    return {
      name: nameMap[type],
      category: categoryMap[type],
      alt: altMap[type],
      chorus,
      processImage: type === "logo"
        ? (file: File) => processImage(file, { maxSizeMB: 1, maxDimension: 500, addWhiteBackground: true })
        : (file: File) => processImage(file, { maxSizeMB: 2, maxDimension: 2000 }),
    };
  };

  // Get current image for the picker
  const getCurrentImage = () => {
    if (!pickerState || !settings) return undefined;
    const { type, chorus, page } = pickerState;

    switch (type) {
      case "logo":
        return settings.logos?.[chorus];
      case "splash":
        return settings.splashBackgrounds?.[chorus];
      case "heroSlide":
        return settings.heroSlideBackground?.[chorus];
      case "banner":
        return settings.pageBanners?.[page!]?.[chorus];
      default:
        return undefined;
    }
  };

  // Get picker title
  const getPickerTitle = () => {
    if (!pickerState) return "Select Image";
    const { type, chorus, page } = pickerState;
    const chorusName = chorusInfo[chorus].name;

    switch (type) {
      case "logo":
        return `Select ${chorusName} Logo`;
      case "splash":
        return `Select ${chorusName} Splash Background`;
      case "heroSlide":
        return `Select ${chorusName} Hero Slideshow Background`;
      case "banner":
        return `Select ${pageInfo[page!].name} Banner for ${chorusName}`;
      default:
        return "Select Image";
    }
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
          Manage logos and page banners for each chorus. Click any image slot to select from the library or upload a new image.
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

      {saving && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg px-6 py-4 flex items-center gap-3 shadow-lg">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
            <span>Saving...</span>
          </div>
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
                <button
                  onClick={() => openPicker("logo", chorus)}
                  className={`w-full border-2 border-dashed rounded-lg p-4 text-center ${chorusInfo[chorus].bgColor} border-gray-300 hover:border-gray-400 hover:bg-opacity-70 transition-all cursor-pointer group`}
                >
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
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">
                    {settings?.logos?.[chorus] ? "Change Image" : "Select Image"}
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Splash Page Backgrounds Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <button
          onClick={() => toggleSection("splash")}
          className="w-full px-6 py-4 bg-gray-800 text-white flex items-center justify-between"
        >
          <div className="text-left">
            <h2 className="font-semibold text-lg">Splash Page Backgrounds</h2>
            <p className="text-sm text-gray-300">Background images for the landing/splash page carousel</p>
          </div>
          {expandedSections.splash ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {expandedSections.splash && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {choruses.map((chorus) => (
              <div key={chorus}>
                <label className={`block text-sm font-medium mb-2 ${chorusInfo[chorus].color}`}>
                  {chorusInfo[chorus].name} Background
                </label>
                <button
                  onClick={() => openPicker("splash", chorus)}
                  className={`w-full border-2 border-dashed rounded-lg p-3 text-center ${chorusInfo[chorus].bgColor} border-gray-300 hover:border-gray-400 hover:bg-opacity-70 transition-all cursor-pointer group`}
                >
                  {settings?.splashBackgrounds?.[chorus] ? (
                    <div className="relative h-24 w-full mb-2">
                      <Image
                        src={settings.splashBackgrounds[chorus]!}
                        alt={`${chorusInfo[chorus].name} splash background`}
                        fill
                        className="object-cover rounded"
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
        )}
      </div>

      {/* Hero Slideshow First Slide Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <button
          onClick={() => toggleSection("heroSlide")}
          className="w-full px-6 py-4 bg-gray-700 text-white flex items-center justify-between"
        >
          <div className="text-left">
            <h2 className="font-semibold text-lg">Hero Slideshow - First Slide</h2>
            <p className="text-sm text-gray-300">Background image for the main hero slideshow (changes based on chorus selection)</p>
          </div>
          {expandedSections.heroSlide ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {expandedSections.heroSlide && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {choruses.map((chorus) => (
              <div key={chorus}>
                <label className={`block text-sm font-medium mb-2 ${chorusInfo[chorus].color}`}>
                  {chorusInfo[chorus].name} Hero Background
                </label>
                <button
                  onClick={() => openPicker("heroSlide", chorus)}
                  className={`w-full border-2 border-dashed rounded-lg p-3 text-center ${chorusInfo[chorus].bgColor} border-gray-300 hover:border-gray-400 hover:bg-opacity-70 transition-all cursor-pointer group`}
                >
                  {settings?.heroSlideBackground?.[chorus] ? (
                    <div className="relative h-24 w-full mb-2">
                      <Image
                        src={settings.heroSlideBackground[chorus]!}
                        alt={`${chorusInfo[chorus].name} hero slideshow background`}
                        fill
                        className="object-cover rounded"
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
                  <button
                    onClick={() => openPicker("banner", chorus, page)}
                    className={`w-full border-2 border-dashed rounded-lg p-3 text-center ${chorusInfo[chorus].bgColor} border-gray-300 hover:border-gray-400 hover:bg-opacity-70 transition-all cursor-pointer group`}
                  >
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
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">
                      {settings?.pageBanners?.[page]?.[chorus] ? "Change Image" : "Select Image"}
                    </span>
                  </button>
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

      {/* Image Picker Modal */}
      <ImagePickerModal
        isOpen={pickerState?.isOpen ?? false}
        onClose={closePicker}
        onSelect={handleImageSelect}
        title={getPickerTitle()}
        currentImage={getCurrentImage()}
        uploadConfig={getUploadConfig()}
      />
    </div>
  );
}
