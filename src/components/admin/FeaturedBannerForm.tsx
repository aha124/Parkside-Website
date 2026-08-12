"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ImageIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ImagePickerModal from "@/components/admin/ImagePickerModal";
import { getBannerStatus } from "@/lib/banner-visibility";
import type { FeaturedBanner } from "@/types/admin";

export type FeaturedBannerFormValues = Omit<
  FeaturedBanner,
  "id" | "createdAt" | "updatedAt" | "createdBy"
>;

interface FeaturedBannerFormProps {
  mode: "create" | "edit";
  initial: FeaturedBannerFormValues;
  bannerId?: string;
  onDelete?: () => Promise<void>;
}

const INPUT_CLASS =
  "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

/** Which image picker is open, if any — the form has two. */
type PickerTarget = "background" | "logo" | null;

function formatDate(value: string): string {
  // Parse as UTC so a "YYYY-MM-DD" string isn't shifted a day by local time.
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function FeaturedBannerForm({
  mode,
  initial,
  bannerId,
  onDelete,
}: FeaturedBannerFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FeaturedBannerFormValues>(initial);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [picker, setPicker] = useState<PickerTarget>(null);

  const status = getBannerStatus(formData);

  const validateClient = (): string | null => {
    if (!formData.headline.trim()) return "Headline is required";
    if (!formData.imageUrl) return "A background image is required";
    if (!formData.linkUrl.trim()) {
      return "A link is required — where should the banner send visitors?";
    }
    if (
      !formData.linkUrl.startsWith("/") &&
      !formData.linkUrl.startsWith("https://")
    ) {
      return 'Link must start with "/" for a page on this site, or "https://"';
    }
    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      return "End date must be on or after the start date";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const clientError = validateClient();
    if (clientError) {
      setError(clientError);
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "create"
          ? "/api/admin/featured-banners"
          : `/api/admin/featured-banners/${bannerId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save banner");
      }

      router.push("/admin/featured-banners");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm(`Delete "${formData.headline}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await onDelete();
      router.push("/admin/featured-banners");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
      setDeleting(false);
    }
  };

  const currentImage =
    picker === "logo" ? formData.logoUrl || "" : formData.imageUrl;

  return (
    <>
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ─── Banner text ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Banner text</h2>
            <p className="text-sm text-gray-500 mt-1">
              The headline shows in large serif type. The lead-in appears before
              it in italics.
            </p>
          </div>

          <div>
            <label htmlFor="leadIn" className="block text-sm font-medium text-gray-700 mb-2">
              Lead-in <span className="text-gray-400">(optional)</span>
            </label>
            <input
              id="leadIn"
              type="text"
              value={formData.leadIn || ""}
              onChange={(e) => setFormData({ ...formData, leadIn: e.target.value })}
              className={INPUT_CLASS}
              placeholder="An Afternoon at"
            />
          </div>

          <div>
            <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-2">
              Headline <span className="text-red-500">*</span>
            </label>
            <input
              id="headline"
              type="text"
              required
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              className={INPUT_CLASS}
              placeholder="The Forum"
            />
          </div>

          <div>
            <label htmlFor="subline" className="block text-sm font-medium text-gray-700 mb-2">
              Date / location line <span className="text-gray-400">(optional)</span>
            </label>
            <input
              id="subline"
              type="text"
              value={formData.subline || ""}
              onChange={(e) => setFormData({ ...formData, subline: e.target.value })}
              className={INPUT_CLASS}
              placeholder="June 13, 2026 · 3:00 PM · Harrisburg, PA"
            />
            <p className="text-xs text-gray-500 mt-1">
              Shown in small gold uppercase type beneath the headline.
            </p>
          </div>
        </div>

        {/* ─── Images ──────────────────────────────────────────────────── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Images</h2>
            <p className="text-sm text-gray-500 mt-1">
              The background sits behind a dark overlay, so choose something with
              room for text.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background image <span className="text-red-500">*</span>
            </label>
            <div className="flex items-start gap-4">
              {formData.imageUrl ? (
                <div className="relative w-48 h-28 rounded-lg overflow-hidden border border-gray-200">
                  <Image src={formData.imageUrl} alt="Banner background" fill className="object-cover" />
                </div>
              ) : (
                <div className="w-48 h-28 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setPicker("background")}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo <span className="text-gray-400">(optional)</span>
            </label>
            <div className="flex items-start gap-4">
              {formData.logoUrl ? (
                <div className="relative w-48 h-28 rounded-lg overflow-hidden border border-gray-200 bg-white">
                  <Image src={formData.logoUrl} alt="Banner logo" fill className="object-contain" />
                </div>
              ) : (
                <div className="w-48 h-28 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setPicker("logo")}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  {formData.logoUrl ? "Change Logo" : "Select Logo"}
                </button>
                {formData.logoUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, logoUrl: "" })}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Shown to the left of the text with a divider. Leave empty for a
              text-only banner.
            </p>
          </div>
        </div>

        {/* ─── Link ────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Link</h2>
            <p className="text-sm text-gray-500 mt-1">
              The whole banner is clickable.
            </p>
          </div>

          <div>
            <label htmlFor="linkUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Links to <span className="text-red-500">*</span>
            </label>
            <input
              id="linkUrl"
              type="text"
              required
              value={formData.linkUrl}
              onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
              className={`${INPUT_CLASS} font-mono`}
              placeholder="/events"
            />
            <p className="text-xs text-gray-500 mt-1">
              A page on this site (e.g. <code>/events</code>) or a full
              <code> https://</code> address. External links open in a new tab.
            </p>
          </div>

          <div>
            <label htmlFor="linkLabel" className="block text-sm font-medium text-gray-700 mb-2">
              Button text <span className="text-gray-400">(optional)</span>
            </label>
            <input
              id="linkLabel"
              type="text"
              value={formData.linkLabel || ""}
              onChange={(e) => setFormData({ ...formData, linkLabel: e.target.value })}
              className={INPUT_CLASS}
              placeholder="Learn More"
            />
            <p className="text-xs text-gray-500 mt-1">
              Defaults to &quot;Learn More&quot;.
            </p>
          </div>
        </div>

        {/* ─── Scheduling ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">When to show it</h2>
            <p className="text-sm text-gray-500 mt-1">
              Set an end date and the banner takes itself down after the show —
              no need to remember.
            </p>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Switched on
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Show from <span className="text-gray-400">(optional)</span>
              </label>
              <input
                id="startDate"
                type="date"
                value={formData.startDate || ""}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className={INPUT_CLASS}
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to show as soon as it&apos;s switched on.
              </p>
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                Hide after <span className="text-gray-400">(optional)</span>
              </label>
              <input
                id="endDate"
                type="date"
                value={formData.endDate || ""}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className={INPUT_CLASS}
              />
              <p className="text-xs text-gray-500 mt-1">
                The banner still shows all of this day. Usually the show date.
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <input
              id="priority"
              type="number"
              min={0}
              max={999}
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: Number(e.target.value) })
              }
              className={`${INPUT_CLASS} sm:w-32`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Only one banner shows at a time. If several are live, the highest
              number wins.
            </p>
          </div>

          {/* Plain-language read-out of what the settings above add up to. */}
          <div
            className={`p-4 rounded-lg text-sm ${
              status === "live"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-gray-50 text-gray-700 border border-gray-200"
            }`}
          >
            {status === "live" && <>Showing on the homepage now.</>}
            {status === "off" && <>Not showing — switch it on above.</>}
            {status === "scheduled" && formData.startDate && (
              <>Scheduled — appears on {formatDate(formData.startDate)}.</>
            )}
            {status === "expired" && formData.endDate && (
              <>Finished — ended {formatDate(formData.endDate)} and is no longer showing.</>
            )}
          </div>
        </div>

        {/* ─── Actions ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            {mode === "edit" && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                <span>{deleting ? "Deleting..." : "Delete banner"}</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/featured-banners"
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              <span>
                {saving
                  ? mode === "create"
                    ? "Creating..."
                    : "Saving..."
                  : mode === "create"
                  ? "Create Banner"
                  : "Save Changes"}
              </span>
            </button>
          </div>
        </div>
      </form>

      <ImagePickerModal
        isOpen={picker !== null}
        onClose={() => setPicker(null)}
        onSelect={(url) =>
          setFormData((prev) =>
            picker === "logo" ? { ...prev, logoUrl: url } : { ...prev, imageUrl: url }
          )
        }
        title={picker === "logo" ? "Select Banner Logo" : "Select Banner Background"}
        currentImage={currentImage}
        uploadConfig={{
          name: formData.headline || "homepage-banner",
          category: "banner",
          alt: formData.headline || "Homepage banner",
          chorus: "voices",
        }}
      />
    </>
  );
}
