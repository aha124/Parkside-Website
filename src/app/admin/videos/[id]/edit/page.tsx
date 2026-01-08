'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

interface VideoData {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  year: number;
  chorus: "harmony" | "melody" | "voices";
  competition?: string;
  placement?: string;
  thumbnailUrl?: string;
}

export default function EditVideoPage() {
  const router = useRouter();
  const params = useParams();
  const videoId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<VideoData>({
    id: "",
    youtubeId: "",
    title: "",
    description: "",
    year: new Date().getFullYear(),
    chorus: "voices",
    competition: "",
    placement: "",
    thumbnailUrl: "",
  });

  // Fetch existing video data
  useEffect(() => {
    async function fetchVideo() {
      try {
        const response = await fetch(`/api/admin/videos/${videoId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("Video not found");
          } else {
            setError("Failed to load video");
          }
          return;
        }

        const data = await response.json();
        if (data.success && data.data) {
          setFormData({
            id: data.data.id,
            youtubeId: data.data.youtubeId,
            title: data.data.title,
            description: data.data.description,
            year: data.data.year,
            chorus: data.data.chorus,
            competition: data.data.competition || "",
            placement: data.data.placement || "",
            thumbnailUrl: data.data.thumbnailUrl || "",
          });
        }
      } catch {
        setError("Failed to load video");
      } finally {
        setFetching(false);
      }
    }

    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/videos/${videoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          youtubeId: formData.youtubeId,
          title: formData.title,
          description: formData.description,
          year: formData.year,
          chorus: formData.chorus,
          competition: formData.competition || undefined,
          placement: formData.placement || undefined,
          thumbnailUrl: formData.thumbnailUrl || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update video");
      }

      router.push("/admin/videos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error && !formData.id) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/videos"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Video</h1>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Edit Video</h1>
          <p className="text-gray-600 mt-1">
            Update video details
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Video Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Video Preview
          </h2>
          <div className="flex gap-6">
            {formData.thumbnailUrl ? (
              <img
                src={formData.thumbnailUrl}
                alt="Video thumbnail"
                className="w-48 h-auto rounded-lg border border-gray-200"
              />
            ) : formData.youtubeId ? (
              <img
                src={`https://img.youtube.com/vi/${formData.youtubeId}/hqdefault.jpg`}
                alt="Video thumbnail"
                className="w-48 h-auto rounded-lg border border-gray-200"
              />
            ) : (
              <div className="w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">No thumbnail</span>
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">YouTube ID</p>
              <p className="font-mono text-gray-900">{formData.youtubeId}</p>
              <a
                href={`https://www.youtube.com/watch?v=${formData.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800 mt-2 inline-block"
              >
                View on YouTube
              </a>
            </div>
          </div>
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
                    chorus: e.target.value as "harmony" | "melody" | "voices",
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="harmony">Parkside Harmony</option>
                <option value="melody">Parkside Melody</option>
                <option value="voices">Parkside Voices (Both)</option>
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
            <span>{loading ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
