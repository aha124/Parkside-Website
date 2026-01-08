"use client";

import { useState, useEffect } from "react";
import {
  ImageIcon,
  RefreshCw,
  Home,
  Info,
  UserPlus,
  Calendar,
  Film,
  Mail,
  Heart,
  ShoppingBag,
  Crown,
  Layers,
  Play,
} from "lucide-react";
import type { SiteSettings, PageKey, ChorusKey, PageContent, AllPageContent } from "@/types/admin";
import ImagePickerModal from "@/components/admin/ImagePickerModal";
import AdminTabs, { Tab } from "@/components/admin/branding/AdminTabs";
import LogosTab from "@/components/admin/branding/LogosTab";
import SplashTab from "@/components/admin/branding/SplashTab";
import HeroSlideshowTab from "@/components/admin/branding/HeroSlideshowTab";
import PageContentTab from "@/components/admin/branding/PageContentTab";
import LeadershipTab from "@/components/admin/branding/LeadershipTab";

// Utility to process images before upload
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

    if (!needsProcessing && !isPng) {
      resolve(file);
      return;
    }

    const img = document.createElement("img");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      let { width, height } = img;

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
        if (addWhiteBackground || isPng) {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, width, height);
        }
        ctx.drawImage(img, 0, 0, width, height);
      }

      const tryCompress = (quality: number): void => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to process image"));
              return;
            }

            if (blob.size <= maxSizeMB * 1024 * 1024 || quality <= 0.1) {
              const outputType = addWhiteBackground ? "image/png" : "image/jpeg";
              const extension = addWhiteBackground ? ".png" : ".jpg";
              const fileName = file.name.replace(/\.[^/.]+$/, "") + extension;

              const processedFile = new File([blob], fileName, {
                type: outputType,
                lastModified: Date.now(),
              });
              resolve(processedFile);
            } else {
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

const pageInfo: Record<PageKey, { name: string; description: string; icon: typeof Home }> = {
  home: { name: "Home", description: "Main landing page hero and slideshow", icon: Home },
  about: { name: "About", description: "About us page banner and content", icon: Info },
  leadership: { name: "Leadership", description: "Leadership team page and member management", icon: Crown },
  join: { name: "Join", description: "Join/membership page banner and content", icon: UserPlus },
  events: { name: "Events", description: "Events listing page banner", icon: Calendar },
  media: { name: "Media", description: "Media gallery page banner", icon: Film },
  contact: { name: "Contact", description: "Contact us page banner and content", icon: Mail },
  donate: { name: "Donate", description: "Donation page banner and messaging", icon: Heart },
  gear: { name: "Gear", description: "Shop/merchandise page banner", icon: ShoppingBag },
};

const chorusInfo: Record<ChorusKey, { name: string; color: string; bgColor: string }> = {
  harmony: { name: "Harmony", color: "text-indigo-700", bgColor: "bg-indigo-100" },
  melody: { name: "Melody", color: "text-amber-700", bgColor: "bg-amber-100" },
  voices: { name: "Voices", color: "text-purple-700", bgColor: "bg-purple-100" },
};

// Tab configuration
const tabs: Tab[] = [
  { id: "logos", label: "Logos", icon: <ImageIcon className="w-4 h-4" /> },
  { id: "splash", label: "Splash Page", icon: <Layers className="w-4 h-4" /> },
  { id: "hero", label: "Hero Slideshow", icon: <Play className="w-4 h-4" /> },
  { id: "home", label: "Home", icon: <Home className="w-4 h-4" /> },
  { id: "about", label: "About", icon: <Info className="w-4 h-4" /> },
  { id: "leadership", label: "Leadership", icon: <Crown className="w-4 h-4" /> },
  { id: "join", label: "Join", icon: <UserPlus className="w-4 h-4" /> },
  { id: "events", label: "Events", icon: <Calendar className="w-4 h-4" /> },
  { id: "media", label: "Media", icon: <Film className="w-4 h-4" /> },
  { id: "contact", label: "Contact", icon: <Mail className="w-4 h-4" /> },
  { id: "donate", label: "Donate", icon: <Heart className="w-4 h-4" /> },
  { id: "gear", label: "Gear", icon: <ShoppingBag className="w-4 h-4" /> },
];

interface PickerState {
  isOpen: boolean;
  type: "logo" | "banner" | "splash" | "heroSlide";
  chorus: ChorusKey;
  page?: PageKey;
}

export default function BrandingPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [pageContent, setPageContent] = useState<AllPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState("logos");
  const [pickerState, setPickerState] = useState<PickerState | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, contentRes] = await Promise.all([
        fetch("/api/admin/site-settings"),
        fetch("/api/admin/page-content"),
      ]);

      const settingsData = await settingsRes.json();
      const contentData = await contentRes.json();

      if (settingsData.success) {
        setSettings(settingsData.data);
      }
      if (contentData.success) {
        setPageContent(contentData.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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
          logos: { ...settings.logos, [chorus]: imageUrl },
        };
      } else if (type === "splash") {
        newSettings = {
          ...settings,
          splashBackgrounds: { ...settings.splashBackgrounds, [chorus]: imageUrl },
        };
      } else if (type === "heroSlide") {
        newSettings = {
          ...settings,
          heroSlideBackground: { ...settings.heroSlideBackground, [chorus]: imageUrl },
        };
      } else {
        newSettings = {
          ...settings,
          pageBanners: {
            ...settings.pageBanners,
            [page!]: { ...settings.pageBanners[page!], [chorus]: imageUrl },
          },
        };
      }

      setSettings(newSettings);
      await saveSettings(newSettings);
      setMessage({ type: "success", text: "Image updated successfully!" });
      setTimeout(() => setMessage(null), 3000);
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

  const handleContentSave = async (pageKey: PageKey, content: PageContent) => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/page-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageKey, content }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }

      // Update local state
      setPageContent((prev) =>
        prev ? { ...prev, [pageKey]: { ...prev[pageKey], ...content } } : null
      );

      setMessage({ type: "success", text: "Content saved successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving content:", error);
      setMessage({ type: "error", text: "Failed to save content" });
    } finally {
      setSaving(false);
    }
  };

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
      logo: "other" as const,
      splash: "banner" as const,
      heroSlide: "slideshow" as const,
      banner: "banner" as const,
    };

    return {
      name: nameMap[type],
      category: categoryMap[type],
      alt: altMap[type],
      chorus,
      processImage:
        type === "logo"
          ? (file: File) =>
              processImage(file, { maxSizeMB: 1, maxDimension: 500, addWhiteBackground: true })
          : (file: File) => processImage(file, { maxSizeMB: 2, maxDimension: 2000 }),
    };
  };

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

  const renderTabContent = () => {
    if (!settings || !pageContent) return null;

    switch (activeTab) {
      case "logos":
        return (
          <LogosTab
            settings={settings}
            onImageSelect={(type, chorus) => openPicker(type, chorus)}
          />
        );
      case "splash":
        return (
          <SplashTab
            settings={settings}
            onImageSelect={(type, chorus) => openPicker(type, chorus)}
          />
        );
      case "hero":
        return (
          <HeroSlideshowTab
            settings={settings}
            onImageSelect={(type, chorus) => openPicker(type, chorus)}
          />
        );
      case "leadership":
        return (
          <LeadershipTab
            pageContent={pageContent.leadership}
            onContentSave={handleContentSave}
            saving={saving}
          />
        );
      default:
        // Regular page tabs
        const pageKey = activeTab as PageKey;
        if (pageInfo[pageKey]) {
          return (
            <PageContentTab
              pageKey={pageKey}
              pageName={pageInfo[pageKey].name}
              pageDescription={pageInfo[pageKey].description}
              settings={settings}
              pageContent={pageContent[pageKey] || {}}
              onImageSelect={(type, chorus, page) => openPicker(type, chorus, page)}
              onContentSave={handleContentSave}
              saving={saving}
            />
          );
        }
        return null;
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
    <div className="space-y-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Site Branding & Content</h1>
        <p className="text-gray-600 mt-1">
          Manage logos, banners, and page content for the entire site
        </p>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`mx-6 mt-4 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Saving Overlay */}
      {saving && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg px-6 py-4 flex items-center gap-3 shadow-lg">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
            <span>Saving...</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <AdminTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="p-6">{renderTabContent()}</div>

      {/* Last Updated */}
      {settings?.updatedAt && (
        <div className="px-6 pb-6">
          <p className="text-sm text-gray-500">
            Last updated: {new Date(settings.updatedAt).toLocaleString()}
            {settings.updatedBy && ` by ${settings.updatedBy}`}
          </p>
        </div>
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
