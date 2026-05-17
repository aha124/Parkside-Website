"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ImageIcon, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ImagePickerModal from "@/components/admin/ImagePickerModal";
import { slugify } from "@/lib/utils";
import type { AdCampaign, AdCampaignPricingTier } from "@/types/admin";

const SLUG_REGEX = /^[a-z0-9-]+$/;
const PAYPAL_BUTTON_ID_REGEX = /^[A-Z0-9]+$/;

export type AdCampaignFormValues = Omit<AdCampaign, "id" | "createdAt" | "updatedAt" | "createdBy">;

interface AdCampaignFormProps {
  mode: "create" | "edit";
  initial: AdCampaignFormValues;
  campaignId?: string;
  onDelete?: () => Promise<void>;
}

function emptyTier(): AdCampaignPricingTier {
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2),
    name: "",
    spec: "",
    price: 0,
    description: "",
    paypalButtonId: "",
  };
}

export default function AdCampaignForm({
  mode,
  initial,
  campaignId,
  onDelete,
}: AdCampaignFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<AdCampaignFormValues>(initial);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  // Track whether slug was edited manually; if not, auto-populate from title.
  const [slugEdited, setSlugEdited] = useState(mode === "edit");

  const updateTier = (index: number, patch: Partial<AdCampaignPricingTier>) => {
    setFormData((prev) => ({
      ...prev,
      pricingTiers: prev.pricingTiers.map((t, i) => (i === index ? { ...t, ...patch } : t)),
    }));
  };

  const addTier = () => {
    setFormData((prev) => ({
      ...prev,
      pricingTiers: [...prev.pricingTiers, emptyTier()],
    }));
  };

  const removeTier = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pricingTiers: prev.pricingTiers.filter((_, i) => i !== index),
    }));
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: slugEdited ? prev.slug : slugify(value),
    }));
  };

  const handleSlugChange = (value: string) => {
    setSlugEdited(true);
    setFormData((prev) => ({ ...prev, slug: value }));
  };

  const validateClient = (): string | null => {
    if (!formData.title.trim()) return "Title is required";
    if (!formData.slug.trim() || !SLUG_REGEX.test(formData.slug)) {
      return "Slug must contain only lowercase letters, numbers, and hyphens";
    }
    if (formData.orderFormUrl && !formData.orderFormUrl.startsWith("https://")) {
      return "Order form URL must start with https://";
    }
    if (formData.pastProgramUrl && !formData.pastProgramUrl.startsWith("https://")) {
      return "Past program URL must start with https://";
    }
    for (const tier of formData.pricingTiers) {
      if (tier.paypalButtonId && !PAYPAL_BUTTON_ID_REGEX.test(tier.paypalButtonId)) {
        return `PayPal button ID for "${tier.name || "tier"}" must be uppercase letters and numbers only`;
      }
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
          ? "/api/admin/ad-campaigns"
          : `/api/admin/ad-campaigns/${campaignId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save campaign");
      }

      router.push("/admin/ad-campaigns");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm(`Delete "${formData.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await onDelete();
      router.push("/admin/ad-campaigns");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
      setDeleting(false);
    }
  };

  return (
    <>
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Advertise in the program for An Afternoon at The Forum"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              required
              value={formData.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
              placeholder="forum-2026"
            />
            <p className="mt-1 text-xs text-gray-500">
              URL: parksidevoices.org/advertise/<span className="font-mono">{formData.slug || "your-slug"}</span>
            </p>
          </div>

          <div>
            <label htmlFor="eventContext" className="block text-sm font-medium text-gray-700 mb-2">
              Event context
            </label>
            <input
              type="text"
              id="eventContext"
              value={formData.eventContext ?? ""}
              onChange={(e) => setFormData({ ...formData, eventContext: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="June 13, 2026 · The Forum Auditorium · Harrisburg, PA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hero image</label>
            <div className="flex items-start gap-4">
              {formData.heroImageUrl ? (
                <div className="relative w-48 h-28 rounded-lg overflow-hidden border border-gray-200">
                  <Image src={formData.heroImageUrl} alt="Hero image" fill className="object-cover" />
                </div>
              ) : (
                <div className="w-48 h-28 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setImagePickerOpen(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  {formData.heroImageUrl ? "Change Image" : "Select Image"}
                </button>
                {formData.heroImageUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, heroImageUrl: "" })}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="pitch" className="block text-sm font-medium text-gray-700 mb-2">
              Pitch copy
            </label>
            <textarea
              id="pitch"
              rows={8}
              value={formData.pitch}
              onChange={(e) => setFormData({ ...formData, pitch: e.target.value })}
              maxLength={5000}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Tell sponsors why they should advertise..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate paragraphs with a blank line. {formData.pitch.length}/5000 characters.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Pricing tiers</h2>
            <button
              type="button"
              onClick={addTier}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add tier</span>
            </button>
          </div>

          {formData.pricingTiers.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">
              No pricing tiers yet. Click &quot;Add tier&quot; to create one.
            </p>
          ) : (
            <div className="space-y-4">
              {formData.pricingTiers.map((tier, index) => (
                <div key={tier.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Tier {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTier(index)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Remove tier"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                      <input
                        type="text"
                        value={tier.name}
                        onChange={(e) => updateTier(index, { name: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        placeholder="Full Page"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Spec</label>
                      <input
                        type="text"
                        value={tier.spec}
                        onChange={(e) => updateTier(index, { spec: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        placeholder="8.5×11, full color"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Price (USD)</label>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={tier.price}
                        onChange={(e) => updateTier(index, { price: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        PayPal hosted button ID
                      </label>
                      <input
                        type="text"
                        value={tier.paypalButtonId ?? ""}
                        onChange={(e) =>
                          updateTier(index, { paypalButtonId: e.target.value.toUpperCase() })
                        }
                        maxLength={20}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono"
                        placeholder="ABC123XYZ"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Description (optional)
                    </label>
                    <textarea
                      rows={2}
                      value={tier.description ?? ""}
                      onChange={(e) => updateTier(index, { description: e.target.value })}
                      maxLength={500}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="What this tier includes..."
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div>
            <label htmlFor="orderFormUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Order form URL
            </label>
            <input
              type="url"
              id="orderFormUrl"
              value={formData.orderFormUrl ?? ""}
              onChange={(e) => setFormData({ ...formData, orderFormUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://forms.google.com/..."
            />
          </div>

          <div>
            <label htmlFor="pastProgramUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Past program URL
            </label>
            <input
              type="url"
              id="pastProgramUrl"
              value={formData.pastProgramUrl ?? ""}
              onChange={(e) => setFormData({ ...formData, pastProgramUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://fliphtml5.com/..."
            />
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
              Deadline
            </label>
            <input
              type="text"
              id="deadline"
              value={formData.deadline ?? ""}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="May 15, 2026"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                Contact name
              </label>
              <input
                type="text"
                id="contactName"
                value={formData.contactName ?? ""}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Contact email
              </label>
              <input
                type="email"
                id="contactEmail"
                value={formData.contactEmail ?? ""}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <div>
              <p className="font-medium text-gray-900">Active</p>
              <p className="text-sm text-gray-500">
                Public URL will render this page. Uncheck to take it offline (returns 404).
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeaturedOnHomepage}
              onChange={(e) => setFormData({ ...formData, isFeaturedOnHomepage: e.target.checked })}
              className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <div>
              <p className="font-medium text-gray-900">Featured on homepage</p>
              <p className="text-sm text-gray-500">
                Show a link to this campaign on the homepage. Only the most recently
                updated featured campaign appears if multiple are featured.
              </p>
            </div>
          </label>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            {mode === "edit" && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                <span>{deleting ? "Deleting..." : "Delete campaign"}</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/ad-campaigns"
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
                  ? "Create Campaign"
                  : "Save Changes"}
              </span>
            </button>
          </div>
        </div>
      </form>

      <ImagePickerModal
        isOpen={imagePickerOpen}
        onClose={() => setImagePickerOpen(false)}
        onSelect={(url) => setFormData({ ...formData, heroImageUrl: url })}
        title="Select Hero Image"
        currentImage={formData.heroImageUrl}
        uploadConfig={{
          name: formData.title || "ad-campaign-hero",
          category: "banner",
          alt: formData.title || "Ad campaign hero",
          chorus: "voices",
        }}
      />
    </>
  );
}
