"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, Upload, RefreshCw, Check, ImageIcon } from "lucide-react";
import type { SiteImage } from "@/types/admin";

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  title?: string;
  currentImage?: string;
  uploadConfig?: {
    name: string;
    category: string;
    alt: string;
    chorus: string;
    processImage?: (file: File) => Promise<File>;
  };
}

type TabType = "library" | "upload";

export default function ImagePickerModal({
  isOpen,
  onClose,
  onSelect,
  title = "Select Image",
  currentImage,
  uploadConfig,
}: ImagePickerModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("library");
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(currentImage || null);
  const [filter, setFilter] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchImages();
      setSelectedImage(currentImage || null);
    }
  }, [isOpen, currentImage]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/images");
      const data = await response.json();
      if (data.success) {
        setImages(data.data);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!uploadConfig) return;

    setUploading(true);
    try {
      // Process image if processor provided
      const processedFile = uploadConfig.processImage
        ? await uploadConfig.processImage(file)
        : file;

      const formData = new FormData();
      formData.append("file", processedFile);
      formData.append("name", uploadConfig.name);
      formData.append("category", uploadConfig.category);
      formData.append("alt", uploadConfig.alt);
      formData.append("chorus", uploadConfig.chorus);

      const response = await fetch("/api/admin/images/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        // Add the new image to the list and select it
        setImages((prev) => [data.data, ...prev]);
        setSelectedImage(data.data.url);
        setActiveTab("library");
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      onClose();
    }
  };

  const filteredImages = filter === "all"
    ? images
    : images.filter((img) => img.category === filter);

  const categories = [
    { value: "all", label: "All Images" },
    { value: "banner", label: "Banners" },
    { value: "slideshow", label: "Slideshow" },
    { value: "hero", label: "Hero" },
    { value: "other", label: "Other" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("library")}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "library"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ImageIcon className="w-4 h-4 inline-block mr-2" />
            Image Library
          </button>
          {uploadConfig && (
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "upload"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Upload className="w-4 h-4 inline-block mr-2" />
              Upload New
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "library" ? (
            <>
              {/* Filter */}
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-gray-500">Filter:</span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setFilter(cat.value)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        filter === cat.value
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No images found</p>
                  {uploadConfig && (
                    <button
                      onClick={() => setActiveTab("upload")}
                      className="mt-3 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      Upload a new image
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {filteredImages.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(image.url)}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === image.url
                          ? "border-indigo-600 ring-2 ring-indigo-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt || image.name}
                        fill
                        className="object-cover"
                      />
                      {selectedImage === image.url && (
                        <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                          <div className="bg-indigo-600 rounded-full p-1">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Upload Tab */
            <div className="flex flex-col items-center justify-center py-12">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />

              {uploading ? (
                <div className="text-center">
                  <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Uploading image...</p>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full max-w-md border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors"
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-400">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            {selectedImage ? (
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Image selected
              </span>
            ) : (
              "Select an image from the library or upload a new one"
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedImage}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
