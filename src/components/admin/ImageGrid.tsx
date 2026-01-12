"use client";

import { useEffect, useState } from "react";
import ImageCard from "./ImageCard";

interface SiteImage {
  id: string;
  name: string;
  url: string;
  alt?: string;
  category?: string;
  chorus?: string;
}

interface ImageUsageLocation {
  type: string;
  label: string;
  details: string;
}

interface ImageUsageData {
  isInUse: boolean;
  locations: ImageUsageLocation[];
}

interface ImageGridProps {
  images: SiteImage[];
  categoryLabels: Record<string, string>;
}

export default function ImageGrid({ images, categoryLabels }: ImageGridProps) {
  const [usage, setUsage] = useState<Record<string, ImageUsageData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsage() {
      try {
        const response = await fetch("/api/admin/images/usage");
        if (response.ok) {
          const data = await response.json();
          setUsage(data.data || {});
        }
      } catch (error) {
        console.error("Failed to fetch image usage:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsage();
  }, []);

  // Group images by category
  const groupedImages = images.reduce(
    (acc, img) => {
      const category = img.category || "other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(img);
      return acc;
    },
    {} as Record<string, SiteImage[]>
  );

  return (
    <div className="space-y-8">
      {Object.entries(categoryLabels).map(([category, label]) => {
        const categoryImages = groupedImages[category] || [];
        if (categoryImages.length === 0) return null;

        return (
          <div
            key={category}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">{label}</h2>
              <p className="text-sm text-gray-500">
                {categoryImages.length} image
                {categoryImages.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoryImages.map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  usage={loading ? undefined : usage[image.url]}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Legend for usage badge */}
      {!loading && Object.keys(usage).length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full mr-2">
              In Use
            </span>
            Images marked &quot;In Use&quot; are currently referenced somewhere
            on the website. Deleting them will cause broken image links.
          </p>
        </div>
      )}
    </div>
  );
}
