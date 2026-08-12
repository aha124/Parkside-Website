"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import FeaturedBannerForm, {
  type FeaturedBannerFormValues,
} from "@/components/admin/FeaturedBannerForm";

const INITIAL: FeaturedBannerFormValues = {
  leadIn: "",
  headline: "",
  subline: "",
  imageUrl: "",
  logoUrl: "",
  linkUrl: "",
  linkLabel: "",
  isActive: true,
  startDate: "",
  endDate: "",
  priority: 0,
};

export default function NewFeaturedBannerPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">New Homepage Banner</h1>
          <p className="text-gray-600 mt-1">
            Promote an upcoming show at the top of the homepage
          </p>
        </div>
      </div>

      <FeaturedBannerForm mode="create" initial={INITIAL} />
    </div>
  );
}
