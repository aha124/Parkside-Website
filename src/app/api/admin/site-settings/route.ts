import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSiteSettings, updateSiteSettings } from "@/lib/admin-data";

// GET - Fetch site settings (admin authenticated via middleware)
// NOTE: This admin route is protected by middleware. The public /api/site-settings route
// provides unauthenticated access for the frontend (logos, banners, etc.).
export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const settings = await updateSiteSettings(body, session.user.email || undefined);
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Error updating site settings:", error);
    return NextResponse.json(
      { error: "Failed to update site settings" },
      { status: 500 }
    );
  }
}
