"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AdCampaignForm, { type AdCampaignFormValues } from "@/components/admin/AdCampaignForm";

const INITIAL: AdCampaignFormValues = {
  title: "",
  slug: "",
  eventContext: "",
  heroImageUrl: "",
  pitch: "",
  pricingTiers: [],
  paypalDropdownButtonId: "",
  paypalDropdownOptionName: "",
  orderFormUrl: "",
  pastProgramUrl: "",
  deadline: "",
  contactName: "",
  contactEmail: "",
  isActive: false,
  isFeaturedOnHomepage: false,
};

export default function NewAdCampaignPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">New Ad Campaign</h1>
          <p className="text-gray-600 mt-1">
            Pitch ad space in a concert program to sponsors
          </p>
        </div>
      </div>

      <AdCampaignForm mode="create" initial={INITIAL} />
    </div>
  );
}
