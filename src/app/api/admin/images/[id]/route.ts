import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getImages, updateImage, deleteImage } from "@/lib/admin-data";
import { del } from "@vercel/blob";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const images = await getImages();
  const item = images.find((i) => i.id === id);

  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: item });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await updateImage(id, body);

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Get image first to get the URL for blob deletion
    const images = await getImages();
    const image = images.find((i) => i.id === id);

    if (!image) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Delete from Vercel Blob
    try {
      await del(image.url);
    } catch (blobError) {
      console.error("Error deleting blob:", blobError);
      // Continue with KV deletion even if blob deletion fails
    }

    // Delete from KV
    const deleted = await deleteImage(id);

    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
