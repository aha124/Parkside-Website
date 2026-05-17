import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/lib/auth";
import { getAdCampaigns, createAdCampaign } from "@/lib/admin-data";
import type { AdCampaignPricingTier } from "@/types/admin";

const SLUG_REGEX = /^[a-z0-9-]+$/;
const PAYPAL_BUTTON_ID_REGEX = /^[A-Z0-9]+$/;
const MAX_PITCH_LENGTH = 5000;
const MAX_TIER_DESCRIPTION_LENGTH = 500;
const MAX_PAYPAL_BUTTON_ID_LENGTH = 20;

function isValidHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const campaigns = await getAdCampaigns();
  return NextResponse.json({ success: true, data: campaigns });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      slug,
      eventContext,
      heroImageUrl,
      pitch,
      pricingTiers,
      orderFormUrl,
      pastProgramUrl,
      deadline,
      contactName,
      contactEmail,
      isActive,
      isFeaturedOnHomepage,
    } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!slug || typeof slug !== "string" || !SLUG_REGEX.test(slug)) {
      return NextResponse.json(
        { error: "Slug is required and must contain only lowercase letters, numbers, and hyphens" },
        { status: 400 }
      );
    }

    if (typeof pitch === "string" && pitch.length > MAX_PITCH_LENGTH) {
      return NextResponse.json(
        { error: `Pitch must be ${MAX_PITCH_LENGTH} characters or less` },
        { status: 400 }
      );
    }

    if (orderFormUrl && !isValidHttpsUrl(orderFormUrl)) {
      return NextResponse.json(
        { error: "Order form URL must be a valid https:// URL" },
        { status: 400 }
      );
    }

    if (pastProgramUrl && !isValidHttpsUrl(pastProgramUrl)) {
      return NextResponse.json(
        { error: "Past program URL must be a valid https:// URL" },
        { status: 400 }
      );
    }

    const tiers: AdCampaignPricingTier[] = Array.isArray(pricingTiers)
      ? pricingTiers.map((tier) => {
          const description = typeof tier.description === "string" ? tier.description : "";
          if (description.length > MAX_TIER_DESCRIPTION_LENGTH) {
            throw new Error(`Tier description must be ${MAX_TIER_DESCRIPTION_LENGTH} characters or less`);
          }
          const paypalButtonId = typeof tier.paypalButtonId === "string" ? tier.paypalButtonId.trim() : "";
          if (paypalButtonId) {
            if (paypalButtonId.length > MAX_PAYPAL_BUTTON_ID_LENGTH || !PAYPAL_BUTTON_ID_REGEX.test(paypalButtonId)) {
              throw new Error("PayPal button ID must be uppercase letters and numbers only");
            }
          }
          return {
            id: typeof tier.id === "string" && tier.id ? tier.id : uuidv4(),
            name: String(tier.name ?? "").trim(),
            spec: String(tier.spec ?? "").trim(),
            price: Number(tier.price) || 0,
            description: description || undefined,
            paypalButtonId: paypalButtonId || undefined,
          };
        })
      : [];

    const campaign = await createAdCampaign({
      title: title.trim(),
      slug: slug.trim(),
      eventContext: typeof eventContext === "string" ? eventContext.trim() || undefined : undefined,
      heroImageUrl: typeof heroImageUrl === "string" ? heroImageUrl : "",
      pitch: typeof pitch === "string" ? pitch : "",
      pricingTiers: tiers,
      orderFormUrl: orderFormUrl ? String(orderFormUrl) : undefined,
      pastProgramUrl: pastProgramUrl ? String(pastProgramUrl) : undefined,
      deadline: typeof deadline === "string" ? deadline.trim() || undefined : undefined,
      contactName: typeof contactName === "string" ? contactName.trim() || undefined : undefined,
      contactEmail: typeof contactEmail === "string" ? contactEmail.trim() || undefined : undefined,
      isActive: Boolean(isActive),
      isFeaturedOnHomepage: Boolean(isFeaturedOnHomepage),
      createdBy: session.user.email || undefined,
    });

    return NextResponse.json({ success: true, data: campaign });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create ad campaign";
    const status = message.includes("already exists") ? 409 : 400;
    console.error("Error creating ad campaign:", error);
    return NextResponse.json({ error: message }, { status });
  }
}
