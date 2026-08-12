"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import FeaturedBannerForm, {
  type FeaturedBannerFormValues,
} from "@/components/admin/FeaturedBannerForm";
import type { FeaturedBanner } from "@/types/admin";

export default function EditFeaturedBannerPage() {
  const params = useParams();
  const bannerId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [initial, setInitial] = useState<FeaturedBannerFormValues | null>(null);

  useEffect(() => {
    async function fetchBanner() {
      try {
        const response = await fetch(`/api/admin/featured-banners/${bannerId}`);
        if (!response.ok) {
          throw new Error("Banner not found");
        }
        const { data } = (await response.json()) as { data: FeaturedBanner };
        setInitial({
          leadIn: data.leadIn ?? "",
          headline: data.headline,
          subline: data.subline ?? "",
          imageUrl: data.imageUrl ?? "",
          logoUrl: data.logoUrl ?? "",
          linkUrl: data.linkUrl ?? "",
          linkLabel: data.linkLabel ?? "",
          isActive: data.isActive,
          startDate: data.startDate ?? "",
          endDate: data.endDate ?? "",
          priority: data.priority ?? 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load banner");
      } finally {
        setLoading(false);
      }
    }
    fetchBanner();
  }, [bannerId]);

  const handleDelete = async () => {
    const response = await fetch(`/api/admin/featured-banners/${bannerId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Failed to delete banner");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !initial) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/featured-banners"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Homepage Banner</h1>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error || "Banner not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/featured-banners"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Homepage Banner</h1>
          <p className="text-gray-600 mt-1">Update banner details</p>
        </div>
      </div>

      <FeaturedBannerForm
        mode="edit"
        initial={initial}
        bannerId={bannerId}
        onDelete={handleDelete}
      />
    </div>
  );
}
