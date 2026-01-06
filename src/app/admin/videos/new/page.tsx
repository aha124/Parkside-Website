'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Search } from "lucide-react";
import Link from "next/link";

export default function NewVideoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const [formData, setFormData] = useState({
    youtubeId: "",
    title: "",
    description: "",
    year: new Date().getFullYear(),
    chorus: "harmony" as "harmony" | "melody" | "both",
    competition: "",
    placement: "",
    thumbnailUrl: "",
  });

  const fetchYouTubeMetadata = async () => {
    if (!youtubeUrl) return;

    setFetching(true);
    setError("");

    try {
      const response = await fetch("/api/admin/youtube-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: youtubeUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch video metadata");
      }

      const data = await response.json();

      if (data.success && data.data) {
        setFormData((prev) => ({
          ...prev,
          youtubeId: data.data.id,
          title: data.data.title,
          thumbnailUrl: data.data.thumbnailUrl,
        }));
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch video information"
      );
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create video");
      }

      router.push("/admin/videos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/videos"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Video</h1>
          <p className="text-gray-600 mt-1">
            Add a YouTube video to the media gallery
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* YouTube URL Fetcher */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Fetch Video Info
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Paste YouTube URL or video ID"
            />
            <button
              type="button"
              onClick={fetchYouTubeMetadata}
              disabled={fetching || !youtubeUrl}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {fetching ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span>Fetch</span>
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Enter a YouTube URL and click Fetch to auto-fill the title and
            thumbnail
          </p>
        </div>

        {/* Video Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Video Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="youtubeId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                YouTube Video ID *
              </label>
              <input
                type="text"
                id="youtubeId"
                required
                value={formData.youtubeId}
                onChange={(e) =>
                  setFormData({ ...formData, youtubeId: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., dQw4w9WgXcQ"
              />
            </div>

            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Year *
              </label>
              <input
                type="number"
                id="year"
                required
                min="1900"
                max="2100"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Video title"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description *
            </label>
            <textarea
              id="description"
              required
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Brief description of the video"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="chorus"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Chorus *
              </label>
              <select
                id="chorus"
                required
                value={formData.chorus}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    chorus: e.target.value as "harmony" | "melody" | "both",
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="harmony">Parkside Harmony</option>
                <option value="melody">Parkside Melody</option>
                <option value="both">Both / Combined</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="competition"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Competition (optional)
              </label>
              <input
                type="text"
                id="competition"
                value={formData.competition}
                onChange={(e) =>
                  setFormData({ ...formData, competition: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., BHS International"
              />
            </div>

            <div>
              <label
                htmlFor="placement"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Placement (optional)
              </label>
              <input
                type="text"
                id="placement"
                value={formData.placement}
                onChange={(e) =>
                  setFormData({ ...formData, placement: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 1st Place"
              />
            </div>
          </div>

          {formData.thumbnailUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail Preview
              </label>
              <img
                src={formData.thumbnailUrl}
                alt="Video thumbnail"
                className="w-48 h-auto rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/videos"
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{loading ? "Adding..." : "Add Video"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
