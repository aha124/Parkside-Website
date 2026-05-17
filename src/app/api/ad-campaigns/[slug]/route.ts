import { NextResponse } from "next/server";
import { getAdCampaignBySlug } from "@/lib/admin-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const campaign = await getAdCampaignBySlug(slug);

  if (!campaign || !campaign.isActive) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: campaign });
}
