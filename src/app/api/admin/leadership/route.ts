import { NextResponse } from "next/server";
import {
  getLeadership,
  createLeadershipMember,
  reorderLeadership,
  seedLeadership,
} from "@/lib/admin-data";
import { auth } from "@/lib/auth";
import type { LeadershipCategory } from "@/types/admin";

const VALID_CATEGORIES: LeadershipCategory[] = ["musicLeadership", "boardMember", "boardAtLarge"];
const MAX_LENGTHS = {
  name: 200,
  title: 200,
  bio: 5000,
  photoUrl: 2000,
};

// GET - Fetch all leadership members (admin authenticated via middleware)
// NOTE: This admin route is protected by middleware. The public /api/leadership route
// provides unauthenticated access for the public leadership page display.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get("category");

    // Validate category if provided
    const category = categoryParam && VALID_CATEGORIES.includes(categoryParam as LeadershipCategory)
      ? (categoryParam as LeadershipCategory)
      : null;

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
      // Validate category
      if (!VALID_CATEGORIES.includes(category)) {
        return NextResponse.json(
          { success: false, error: "Invalid category" },
          { status: 400 }
        );
      }
      // Validate orderedIds is an array of strings
      if (!Array.isArray(orderedIds) || !orderedIds.every((id) => typeof id === "string")) {
        return NextResponse.json(
          { success: false, error: "orderedIds must be an array of strings" },
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

    // Validate types
    if (typeof name !== "string" || typeof title !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid field types" },
        { status: 400 }
      );
    }

    // Validate category
    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { success: false, error: "Invalid category" },
        { status: 400 }
      );
    }

    // Validate lengths
    if (
      name.length > MAX_LENGTHS.name ||
      title.length > MAX_LENGTHS.title ||
      (bio && typeof bio === "string" && bio.length > MAX_LENGTHS.bio) ||
      (photoUrl && typeof photoUrl === "string" && photoUrl.length > MAX_LENGTHS.photoUrl)
    ) {
      return NextResponse.json(
        { success: false, error: "One or more fields exceed maximum length" },
        { status: 400 }
      );
    }

    // Validate chorusAffiliation if provided
    const validAffiliation = chorusAffiliation === "harmony" || chorusAffiliation === "melody" || chorusAffiliation === "both"
      ? chorusAffiliation
      : null;

    // Validate order is a number
    const validOrder = typeof order === "number" && !isNaN(order) ? order : 0;

    const newMember = await createLeadershipMember({
      name: name.trim(),
      title: title.trim(),
      bio: typeof bio === "string" ? bio.trim() : "",
      photoUrl: typeof photoUrl === "string" ? photoUrl : "",
      category,
      chorusAffiliation: validAffiliation,
      order: validOrder,
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
