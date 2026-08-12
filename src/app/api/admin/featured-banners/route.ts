import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getFeaturedBanners, createFeaturedBanner } from "@/lib/admin-data";
import { validateBannerInput } from "@/lib/featured-banner-validation";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const banners = await getFeaturedBanners();
  return NextResponse.json({ success: true, data: banners });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = validateBannerInput(await request.json());
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const banner = await createFeaturedBanner({
      ...result.value,
      createdBy: session.user.email || undefined,
    });

    return NextResponse.json({ success: true, data: banner });
  } catch (error) {
    console.error("Error creating featured banner:", error);
    return NextResponse.json({ error: "Failed to create banner" }, { status: 400 });
  }
}
