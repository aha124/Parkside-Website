"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import AdCampaignForm, { type AdCampaignFormValues } from "@/components/admin/AdCampaignForm";
import type { AdCampaign } from "@/types/admin";

export default function EditAdCampaignPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [initial, setInitial] = useState<AdCampaignFormValues | null>(null);

  useEffect(() => {
    async function fetchCampaign() {
      try {
        const response = await fetch(`/api/admin/ad-campaigns/${campaignId}`);
        if (!response.ok) {
          throw new Error("Campaign not found");
        }
        const { data } = (await response.json()) as { data: AdCampaign };
        setInitial({
          title: data.title,
          slug: data.slug,
          eventContext: data.eventContext ?? "",
          heroImageUrl: data.heroImageUrl ?? "",
          pitch: data.pitch ?? "",
          pricingTiers: data.pricingTiers ?? [],
          paypalDropdownButtonId: data.paypalDropdownButtonId ?? "",
          paypalDropdownOptionName: data.paypalDropdownOptionName ?? "",
          orderFormUrl: data.orderFormUrl ?? "",
          pastProgramUrl: data.pastProgramUrl ?? "",
          deadline: data.deadline ?? "",
          contactName: data.contactName ?? "",
          contactEmail: data.contactEmail ?? "",
          isActive: data.isActive,
          isFeaturedOnHomepage: data.isFeaturedOnHomepage,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load campaign");
      } finally {
        setLoading(false);
      }
    }
    fetchCampaign();
  }, [campaignId]);

  const handleDelete = async () => {
    const response = await fetch(`/api/admin/ad-campaigns/${campaignId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Failed to delete campaign");
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
            href="/admin/ad-campaigns"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Ad Campaign</h1>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error || "Campaign not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/ad-campaigns"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Ad Campaign</h1>
          <p className="text-gray-600 mt-1">Update campaign details</p>
        </div>
      </div>

      <AdCampaignForm
        mode="edit"
        initial={initial}
        campaignId={campaignId}
        onDelete={handleDelete}
      />
    </div>
  );
}
