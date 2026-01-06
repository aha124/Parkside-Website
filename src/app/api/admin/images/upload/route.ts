import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { put } from "@vercel/blob";
import { createImage } from "@/lib/admin-data";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const alt = formData.get("alt") as string;
    const chorus = (formData.get("chorus") as string) || "voices";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const extension = file.name.split(".").pop() || "jpg";
    const filename = `${category}/${timestamp}-${name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    });

    // Save metadata to KV
    const image = await createImage({
      name,
      url: blob.url,
      category: category as "slideshow" | "hero" | "banner" | "progression" | "other",
      chorus: chorus as "harmony" | "melody" | "voices",
      alt: alt || undefined,
      createdBy: session.user.email || undefined,
    });

    return NextResponse.json({ success: true, data: image });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
