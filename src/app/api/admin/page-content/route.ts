import { NextResponse } from "next/server";
import { getPageContent, updatePageContent, updateAllPageContent } from "@/lib/admin-data";
import { auth } from "@/lib/auth";
import type { PageKey } from "@/types/admin";

// GET - Fetch all page content (admin only)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

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

// PUT - Update page content (single page or all pages)
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { pageKey, content, allContent } = body;

    // If updating all pages at once
    if (allContent) {
      const updated = await updateAllPageContent(allContent, session.user.email ?? undefined);
      return NextResponse.json({ success: true, data: updated });
    }

    // If updating a single page
    if (pageKey && content) {
      const updated = await updatePageContent(pageKey as PageKey, content, session.user.email ?? undefined);
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json(
      { success: false, error: "Missing pageKey and content or allContent" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error updating page content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update page content" },
      { status: 500 }
    );
  }
}
