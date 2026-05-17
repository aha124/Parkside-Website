import { NextResponse } from "next/server";
import { getAdCampaigns } from "@/lib/admin-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featuredOnly = searchParams.get("featured") === "true";

  const campaigns = await getAdCampaigns();

  const filtered = campaigns.filter((c) => {
    if (!c.isActive) return false;
    if (featuredOnly && !c.isFeaturedOnHomepage) return false;
    return true;
  });

  // Public list endpoint returns only safe fields (no contact info, no PayPal IDs)
  const minimal = filtered.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    eventContext: c.eventContext,
    updatedAt: c.updatedAt,
  }));

  return NextResponse.json({ success: true, data: minimal });
}
