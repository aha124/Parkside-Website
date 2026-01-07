"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Save, RefreshCw } from "lucide-react";
import type { SiteImage, ChorusTag } from "@/types/admin";

interface PageProps {
  params: Promise<{ id: string }>;
}

const categories = [
  { value: "slideshow", label: "Home Slideshow" },
  { value: "hero", label: "Hero Banners" },
  { value: "banner", label: "Page Banners" },
  { value: "progression", label: "Progression Gallery" },
  { value: "other", label: "Other" },
];

const chorusOptions = [
  { value: "harmony", label: "Harmony" },
  { value: "melody", label: "Melody" },
  { value: "voices", label: "Voices (Both)" },
];

export default function EditImagePage({ params }: PageProps) {
  const router = useRouter();
  const [imageId, setImageId] = useState<string | null>(null);
  const [image, setImage] = useState<SiteImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [alt, setAlt] = useState("");
  const [category, setCategory] = useState<SiteImage["category"]>("other");
  const [chorus, setChorus] = useState<ChorusTag>("voices");

  // Unwrap params
  useEffect(() => {
    params.then((p) => setImageId(p.id));
  }, [params]);

  // Fetch image data
  useEffect(() => {
    if (!imageId) return;

    const fetchImage = async () => {
      try {
        const response = await fetch(`/api/admin/images/${imageId}`);
        const data = await response.json();

        if (data.success) {
          setImage(data.data);
          setName(data.data.name);
          setAlt(data.data.alt || "");
          setCategory(data.data.category);
          setChorus(data.data.chorus);
        } else {
          setMessage({ type: "error", text: "Image not found" });
        }
      } catch (error) {
        console.error("Error fetching image:", error);
        setMessage({ type: "error", text: "Failed to load image" });
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [imageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageId) return;

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/images/${imageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          alt,
          category,
          chorus,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Image updated successfully!" });
        setImage(data.data);
        // Redirect back to images list after a short delay
        setTimeout(() => router.push("/admin/images"), 1500);
      } else {
        throw new Error(data.error || "Failed to update image");
      }
    } catch (error) {
      console.error("Error updating image:", error);
      setMessage({ type: "error", text: "Failed to update image" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/images"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Images
        </Link>
        <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-200">
          Image not found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/images"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Image</h1>
          <p className="text-gray-600 mt-1">Update image metadata and tags</p>
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Preview</h2>
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={image.url}
              alt={image.alt || image.name}
              fill
              className="object-contain"
            />
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-500">
              <span className="font-medium">URL:</span>{" "}
              <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all">
                {image.url}
              </code>
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-medium">Uploaded:</span>{" "}
              {new Date(image.createdAt).toLocaleString()}
            </p>
            {image.updatedAt && image.updatedAt !== image.createdAt && (
              <p className="text-sm text-gray-500">
                <span className="font-medium">Last updated:</span>{" "}
                {new Date(image.updatedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Image Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                A descriptive name for the image
              </p>
            </div>

            <div>
              <label htmlFor="alt" className="block text-sm font-medium text-gray-700 mb-1">
                Alt Text / Description
              </label>
              <textarea
                id="alt"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe the image for accessibility and search..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Add keywords and descriptions to help find this image later
              </p>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as SiteImage["category"])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="chorus" className="block text-sm font-medium text-gray-700 mb-1">
                Chorus Association
              </label>
              <select
                id="chorus"
                value={chorus}
                onChange={(e) => setChorus(e.target.value as ChorusTag)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {chorusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <Link
                href="/admin/images"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
