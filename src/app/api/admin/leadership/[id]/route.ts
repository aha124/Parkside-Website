import { NextResponse } from "next/server";
import { updateLeadershipMember, deleteLeadershipMember, getLeadership } from "@/lib/admin-data";
import { auth } from "@/lib/auth";

// GET - Fetch single leadership member
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadership = await getLeadership();
    const member = leadership.find((m) => m.id === id);

    if (!member) {
      return NextResponse.json(
        { success: false, error: "Leadership member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: member });
  } catch (error) {
    console.error("Error fetching leadership member:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leadership member" },
      { status: 500 }
    );
  }
}

// PUT - Update leadership member
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const updated = await updateLeadershipMember(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Leadership member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating leadership member:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update leadership member" },
      { status: 500 }
    );
  }
}

// DELETE - Delete leadership member
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const deleted = await deleteLeadershipMember(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Leadership member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error) {
    console.error("Error deleting leadership member:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete leadership member" },
      { status: 500 }
    );
  }
}
