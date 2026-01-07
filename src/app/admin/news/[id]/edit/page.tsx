'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ChorusSelector from "@/components/admin/ChorusSelector";
import ImagePickerModal from "@/components/admin/ImagePickerModal";
import { ChorusTag } from "@/types/admin";

interface NewsData {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  imageUrl: string;
  chorus: ChorusTag;
}

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [formData, setFormData] = useState<NewsData>({
    id: "",
    title: "",
    date: "",
    summary: "",
    content: "",
    imageUrl: "",
    chorus: "voices",
  });

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch(`/api/admin/news/${newsId}`);
        if (!response.ok) {
          throw new Error("News article not found");
        }
        const data = await response.json();
        setFormData({
          ...data.data,
          chorus: data.data.chorus?.toLowerCase() || "voices",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load news article");
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [newsId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/news/${newsId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update news article");
      }

      router.push("/admin/news");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/news"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit News Article</h1>
          <p className="text-gray-600 mt-1">Update article details</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
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
              placeholder="Enter article title"
            />
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Date *
            </label>
            <input
              type="text"
              id="date"
              required
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., January 6, 2025"
            />
          </div>

          <div>
            <label
              htmlFor="summary"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Summary *
            </label>
            <textarea
              id="summary"
              required
              rows={3}
              value={formData.summary}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Brief summary shown in news listings"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Content
            </label>
            <textarea
              id="content"
              rows={8}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Full article content (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Article Image
            </label>
            <div className="flex items-start gap-4">
              {formData.imageUrl ? (
                <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={formData.imageUrl}
                    alt="Article image"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-40 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setImagePickerOpen(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  {formData.imageUrl ? "Change Image" : "Select Image"}
                </button>
                {formData.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: "" })}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <ChorusSelector
            value={formData.chorus}
            onChange={(chorus) => setFormData({ ...formData, chorus })}
          />
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/news"
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </form>

      <ImagePickerModal
        isOpen={imagePickerOpen}
        onClose={() => setImagePickerOpen(false)}
        onSelect={(url) => setFormData({ ...formData, imageUrl: url })}
        title="Select Article Image"
        currentImage={formData.imageUrl}
        uploadConfig={{
          name: formData.title || "news-image",
          category: "other",
          alt: formData.title || "News article image",
          chorus: formData.chorus,
        }}
      />
    </div>
  );
}
