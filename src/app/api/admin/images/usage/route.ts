import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllImagesUsage } from "@/lib/admin-data";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const usageMap = await getAllImagesUsage();

    // Convert Map to object for JSON serialization
    const usage: Record<string, { isInUse: boolean; locations: Array<{ type: string; label: string; details: string }> }> = {};
    for (const [url, data] of usageMap.entries()) {
      usage[url] = data;
    }

    return NextResponse.json({ success: true, data: usage });
  } catch (error) {
    console.error("Error fetching image usage:", error);
    return NextResponse.json(
      { error: "Failed to fetch image usage" },
      { status: 500 }
    );
  }
}
