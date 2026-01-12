import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/admin-data";

// Public GET - Fetch site settings for public display
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
