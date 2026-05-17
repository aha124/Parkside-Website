import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/lib/auth";
import {
  getAdCampaignById,
  updateAdCampaign,
  deleteAdCampaign,
} from "@/lib/admin-data";
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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const campaign = await getAdCampaignById(id);

  if (!campaign) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: campaign });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
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

    if (title !== undefined && (!title || typeof title !== "string" || !title.trim())) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (slug !== undefined && (!slug || typeof slug !== "string" || !SLUG_REGEX.test(slug))) {
      return NextResponse.json(
        { error: "Slug must contain only lowercase letters, numbers, and hyphens" },
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

    let normalizedTiers: AdCampaignPricingTier[] | undefined;
    if (Array.isArray(pricingTiers)) {
      normalizedTiers = pricingTiers.map((tier) => {
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
      });
    }

    const updated = await updateAdCampaign(id, {
      ...(title !== undefined ? { title: String(title).trim() } : {}),
      ...(slug !== undefined ? { slug: String(slug).trim() } : {}),
      ...(eventContext !== undefined
        ? { eventContext: typeof eventContext === "string" ? eventContext.trim() || undefined : undefined }
        : {}),
      ...(heroImageUrl !== undefined ? { heroImageUrl: String(heroImageUrl) } : {}),
      ...(pitch !== undefined ? { pitch: String(pitch) } : {}),
      ...(normalizedTiers !== undefined ? { pricingTiers: normalizedTiers } : {}),
      ...(orderFormUrl !== undefined ? { orderFormUrl: orderFormUrl ? String(orderFormUrl) : undefined } : {}),
      ...(pastProgramUrl !== undefined ? { pastProgramUrl: pastProgramUrl ? String(pastProgramUrl) : undefined } : {}),
      ...(deadline !== undefined
        ? { deadline: typeof deadline === "string" ? deadline.trim() || undefined : undefined }
        : {}),
      ...(contactName !== undefined
        ? { contactName: typeof contactName === "string" ? contactName.trim() || undefined : undefined }
        : {}),
      ...(contactEmail !== undefined
        ? { contactEmail: typeof contactEmail === "string" ? contactEmail.trim() || undefined : undefined }
        : {}),
      ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
      ...(isFeaturedOnHomepage !== undefined ? { isFeaturedOnHomepage: Boolean(isFeaturedOnHomepage) } : {}),
    });

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update ad campaign";
    const status = message.includes("already exists") ? 409 : 400;
    console.error("Error updating ad campaign:", error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deleted = await deleteAdCampaign(id);

    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting ad campaign:", error);
    return NextResponse.json(
      { error: "Failed to delete ad campaign" },
      { status: 500 }
    );
  }
}
