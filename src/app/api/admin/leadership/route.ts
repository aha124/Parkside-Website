import { NextResponse } from "next/server";
import {
  getLeadership,
  createLeadershipMember,
  reorderLeadership,
  seedLeadership,
} from "@/lib/admin-data";
import { auth } from "@/lib/auth";
import type { LeadershipCategory } from "@/types/admin";

// GET - Fetch all leadership members (admin authenticated via middleware)
// NOTE: This admin route is protected by middleware. The public /api/leadership route
// provides unauthenticated access for the public leadership page display.
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

    // Sort by category and order
    const sorted = leadership.sort((a, b) => {
      const categoryOrder = { musicLeadership: 0, boardMember: 1, boardAtLarge: 2 };
      const catDiff = categoryOrder[a.category] - categoryOrder[b.category];
      if (catDiff !== 0) return catDiff;
      return a.order - b.order;
    });

    return NextResponse.json({ success: true, data: sorted });
  } catch (error) {
    console.error("Error fetching leadership:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leadership" },
      { status: 500 }
    );
  }
}

// POST - Create new leadership member or reorder
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Handle reordering
    if (body.action === "reorder") {
      const { category, orderedIds } = body;
      if (!category || !orderedIds) {
        return NextResponse.json(
          { success: false, error: "Missing category or orderedIds" },
          { status: 400 }
        );
      }
      const updated = await reorderLeadership(category, orderedIds);
      return NextResponse.json({ success: true, data: updated });
    }

    // Handle seeding default data
    if (body.action === "seed") {
      const result = await seedLeadership(session.user.email ?? undefined);
      return NextResponse.json({ success: true, data: result });
    }

    // Create new member
    const { name, title, bio, photoUrl, category, chorusAffiliation, order } = body;

    if (!name || !title || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, title, category" },
        { status: 400 }
      );
    }

    const newMember = await createLeadershipMember({
      name,
      title,
      bio: bio || "",
      photoUrl: photoUrl || "",
      category,
      chorusAffiliation,
      order: order ?? 0,
      createdBy: session.user.email ?? undefined,
    });

    return NextResponse.json({ success: true, data: newMember });
  } catch (error) {
    console.error("Error creating leadership member:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create leadership member" },
      { status: 500 }
    );
  }
}
