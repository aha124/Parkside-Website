"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Upload, Save, RefreshCw } from "lucide-react";
import type { SiteSettings, ChorusBranding } from "@/types/admin";

type ChorusKey = "harmony" | "melody" | "voices";

const chorusInfo: Record<ChorusKey, { name: string; color: string }> = {
  harmony: { name: "Parkside Harmony", color: "bg-indigo-500" },
  melody: { name: "Parkside Melody", color: "bg-amber-500" },
  voices: { name: "Parkside Voices", color: "bg-purple-500" },
};

export default function BrandingPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
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
    chorus: ChorusKey,
    field: keyof ChorusBranding,
    file: File
  ) => {
    const uploadKey = `${chorus}-${field}`;
    setUploading(uploadKey);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", `${chorus}-${field}`);
      formData.append("category", field === "logoUrl" ? "other" : "banner");
      formData.append("alt", `${chorusInfo[chorus].name} ${field.replace("Url", "")}`);
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
      const newSettings = {
        ...settings!,
        [chorus]: {
          ...settings![chorus],
          [field]: uploadData.data.url,
        },
      };
      setSettings(newSettings);

      // Save to server
      await saveSettings(newSettings);
      setMessage({ type: "success", text: `${chorusInfo[chorus].name} ${field.replace("Url", "")} updated!` });
    } catch (error) {
      console.error("Error uploading:", error);
      setMessage({ type: "error", text: "Failed to upload image" });
    } finally {
      setUploading(null);
    }
  };

  const saveSettings = async (settingsToSave: SiteSettings) => {
    setSaving(true);
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
    } finally {
      setSaving(false);
    }
  };

  const triggerFileInput = (key: string) => {
    fileInputRefs.current[key]?.click();
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
          Manage logos and banner images for each chorus
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

      <div className="space-y-8">
        {(["harmony", "melody", "voices"] as ChorusKey[]).map((chorus) => (
          <div
            key={chorus}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className={`px-6 py-4 ${chorusInfo[chorus].color} text-white`}>
              <h2 className="font-semibold text-lg">{chorusInfo[chorus].name}</h2>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {settings?.[chorus]?.logoUrl ? (
                    <div className="relative h-24 w-24 mx-auto mb-2">
                      <Image
                        src={settings[chorus].logoUrl!}
                        alt={`${chorusInfo[chorus].name} logo`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-24 w-24 mx-auto mb-2 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No logo</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={(el) => { fileInputRefs.current[`${chorus}-logoUrl`] = el; }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(chorus, "logoUrl", file);
                    }}
                  />
                  <button
                    onClick={() => triggerFileInput(`${chorus}-logoUrl`)}
                    disabled={uploading === `${chorus}-logoUrl`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
                  >
                    {uploading === `${chorus}-logoUrl` ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    Upload Logo
                  </button>
                </div>
              </div>

              {/* Banner */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {settings?.[chorus]?.bannerUrl ? (
                    <div className="relative h-24 w-full mb-2">
                      <Image
                        src={settings[chorus].bannerUrl!}
                        alt={`${chorusInfo[chorus].name} banner`}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className="h-24 w-full mb-2 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No banner</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={(el) => { fileInputRefs.current[`${chorus}-bannerUrl`] = el; }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(chorus, "bannerUrl", file);
                    }}
                  />
                  <button
                    onClick={() => triggerFileInput(`${chorus}-bannerUrl`)}
                    disabled={uploading === `${chorus}-bannerUrl`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
                  >
                    {uploading === `${chorus}-bannerUrl` ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    Upload Banner
                  </button>
                </div>
              </div>

              {/* Hero Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {settings?.[chorus]?.heroImageUrl ? (
                    <div className="relative h-24 w-full mb-2">
                      <Image
                        src={settings[chorus].heroImageUrl!}
                        alt={`${chorusInfo[chorus].name} hero`}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className="h-24 w-full mb-2 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No hero image</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={(el) => { fileInputRefs.current[`${chorus}-heroImageUrl`] = el; }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(chorus, "heroImageUrl", file);
                    }}
                  />
                  <button
                    onClick={() => triggerFileInput(`${chorus}-heroImageUrl`)}
                    disabled={uploading === `${chorus}-heroImageUrl`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
                  >
                    {uploading === `${chorus}-heroImageUrl` ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    Upload Hero
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {settings?.updatedAt && (
        <p className="text-sm text-gray-500">
          Last updated: {new Date(settings.updatedAt).toLocaleString()}
          {settings.updatedBy && ` by ${settings.updatedBy}`}
        </p>
      )}
    </div>
  );
}
