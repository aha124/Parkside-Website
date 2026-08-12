import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getFeaturedBannerById,
  updateFeaturedBanner,
  deleteFeaturedBanner,
} from "@/lib/admin-data";
import { validateBannerInput } from "@/lib/featured-banner-validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const banner = await getFeaturedBannerById(id);

  if (!banner) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: banner });
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

    // The edit form always submits every field, so this validates and replaces
    // the whole banner rather than patching individual keys.
    const result = validateBannerInput(await request.json());
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const updated = await updateFeaturedBanner(id, result.value);

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating featured banner:", error);
    return NextResponse.json({ error: "Failed to update banner" }, { status: 400 });
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
    const deleted = await deleteFeaturedBanner(id);

    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting featured banner:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
