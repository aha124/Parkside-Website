import { NextResponse } from "next/server";
import { getFeaturedBanners } from "@/lib/admin-data";
import { selectActiveBanner } from "@/lib/banner-visibility";

/**
 * Public endpoint for the homepage banner.
 *
 * Returns the single banner that should render right now, or null. Schedule
 * filtering happens here rather than in the browser so the visitor's clock and
 * timezone can't resurrect an expired banner.
 */
export async function GET() {
  const banners = await getFeaturedBanners();
  const active = selectActiveBanner(banners);

  if (!active) {
    return NextResponse.json({ success: true, data: null });
  }

  // Only the fields the banner actually renders — no scheduling or audit data.
  return NextResponse.json({
    success: true,
    data: {
      id: active.id,
      leadIn: active.leadIn,
      headline: active.headline,
      subline: active.subline,
      imageUrl: active.imageUrl,
      logoUrl: active.logoUrl,
      linkUrl: active.linkUrl,
      linkLabel: active.linkLabel,
    },
  });
}
