import { NextResponse } from "next/server";
import { getLeadership } from "@/lib/admin-data";
import type { LeadershipCategory } from "@/types/admin";

// Public GET - Fetch leadership members for public display
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as LeadershipCategory | null;

    const leadership = await getLeadership();

    if (category) {
      const filtered = leadership
        .filter((m) => m.category === category)
        .sort((a, b) => a.order - b.order);
      return NextResponse.json({ success: true, data: filtered });
    }

    // Group by category for public display
    const grouped = {
      musicLeadership: leadership
        .filter((m) => m.category === "musicLeadership")
        .sort((a, b) => a.order - b.order),
      boardMembers: leadership
        .filter((m) => m.category === "boardMember")
        .sort((a, b) => a.order - b.order),
      boardAtLarge: leadership
        .filter((m) => m.category === "boardAtLarge")
        .sort((a, b) => a.order - b.order),
    };

    return NextResponse.json({ success: true, data: grouped });
  } catch (error) {
    console.error("Error fetching leadership:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leadership" },
      { status: 500 }
    );
  }
}
