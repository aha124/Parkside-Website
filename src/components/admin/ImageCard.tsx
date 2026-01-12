"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, Trash2, Loader2, AlertTriangle, Link2 } from "lucide-react";
import CopyUrlButton from "./CopyUrlButton";

interface ImageUsageLocation {
  type: string;
  label: string;
  details: string;
}

interface ImageCardProps {
  image: {
    id: string;
    name: string;
    url: string;
    alt?: string;
  };
  usage?: {
    isInUse: boolean;
    locations: ImageUsageLocation[];
  };
}

export default function ImageCard({ image, usage }: ImageCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isInUse = usage?.isInUse ?? false;
  const locations = usage?.locations ?? [];

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/images/${image.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete. Please try again.");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="group relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
        <img
          src={image.url}
          alt={image.alt || image.name}
          className="w-full h-full object-cover"
        />

        {/* Usage indicator badge */}
        {isInUse && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Link2 className="w-3 h-3" />
            <span>In Use</span>
          </div>
        )}

        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <CopyUrlButton url={image.url} />
          <Link
            href={`/admin/images/${image.id}/edit`}
            className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setShowConfirm(true)}
            className="p-2 bg-white rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Image name */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-white text-sm truncate">{image.name}</p>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isInUse ? "Warning: Image In Use" : "Confirm Delete"}
            </h3>

            {isInUse ? (
              <div className="mb-4">
                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">
                      This image is currently being used on the website.
                    </p>
                    <p>
                      Deleting it will cause broken image links in the following
                      locations:
                    </p>
                  </div>
                </div>

                <div className="max-h-40 overflow-y-auto space-y-2 mb-4">
                  {locations.map((loc, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-50 rounded border border-gray-200 text-sm"
                    >
                      <span className="font-medium text-gray-700">
                        {loc.label}:
                      </span>{" "}
                      <span className="text-gray-600">{loc.details}</span>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-gray-600">
                  Please replace this image in the locations above before
                  deleting, or proceed at your own risk.
                </p>
              </div>
            ) : (
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete &quot;{image.name}&quot;? This
                action cannot be undone.
              </p>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${
                  isInUse
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>
                  {loading
                    ? "Deleting..."
                    : isInUse
                      ? "Delete Anyway"
                      : "Delete"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
