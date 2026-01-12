import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { put } from "@vercel/blob";
import { createImage } from "@/lib/admin-data";

// Note: For large image uploads on Vercel, files should be under ~4.5MB due to serverless payload limits.
// For larger files, consider using client-side direct uploads to Vercel Blob.

// Allowed file types and their MIME types
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5MB
const VALID_CATEGORIES = ["slideshow", "hero", "banner", "progression", "other"] as const;
const VALID_CHORUS = ["harmony", "melody", "voices"] as const;

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

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Validate name length
    if (name.length > 200) {
      return NextResponse.json({ error: "Name too long" }, { status: 400 });
    }

    // Validate file type by MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 4.5MB." },
        { status: 400 }
      );
    }

    // Validate and sanitize category
    const validCategory = VALID_CATEGORIES.includes(category as typeof VALID_CATEGORIES[number])
      ? (category as typeof VALID_CATEGORIES[number])
      : "other";

    // Validate and sanitize chorus
    const validChorus = VALID_CHORUS.includes(chorus as typeof VALID_CHORUS[number])
      ? (chorus as typeof VALID_CHORUS[number])
      : "voices";

    // Get extension from MIME type (more reliable than filename)
    const mimeToExt: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
    };
    const extension = mimeToExt[file.type] || "jpg";

    // Generate a unique filename with sanitized name
    const timestamp = Date.now();
    const sanitizedName = name.replace(/[^a-z0-9]/gi, "-").toLowerCase().slice(0, 50);
    const filename = `${validCategory}/${timestamp}-${sanitizedName}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    });

    // Save metadata to KV
    const image = await createImage({
      name,
      url: blob.url,
      category: validCategory,
      chorus: validChorus,
      alt: typeof alt === "string" ? alt.slice(0, 500) : undefined,
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
