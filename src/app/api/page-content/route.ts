import { NextResponse } from "next/server";
import { getPageContent } from "@/lib/admin-data";

// Public GET - Fetch page content for public display
export async function GET() {
  try {
    const content = await getPageContent();
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error("Error fetching page content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch page content" },
      { status: 500 }
    );
  }
}
