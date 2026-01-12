import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSiteSettings, updateSiteSettings } from "@/lib/admin-data";

// GET - Fetch site settings (admin authenticated via middleware)
// NOTE: This admin route is protected by middleware. The public /api/site-settings route
// provides unauthenticated access for the frontend (logos, banners, etc.).
export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}

// Recursively validate that all string values in an object don't exceed max length
// and that there are no prototype pollution attempts
function validateSettingsObject(obj: unknown, maxStringLength = 2000, depth = 0): boolean {
  if (depth > 10) return false; // Prevent deeply nested objects
  if (obj === null || obj === undefined) return true;
  if (typeof obj === "string") return obj.length <= maxStringLength;
  if (typeof obj === "number" || typeof obj === "boolean") return true;
  if (Array.isArray(obj)) {
    return obj.length <= 100 && obj.every((item) => validateSettingsObject(item, maxStringLength, depth + 1));
  }
  if (typeof obj === "object") {
    const keys = Object.keys(obj);
    if (keys.length > 100) return false;
    // Check for prototype pollution
    if (keys.includes("__proto__") || keys.includes("constructor") || keys.includes("prototype")) {
      return false;
    }
    return keys.every((key) => validateSettingsObject((obj as Record<string, unknown>)[key], maxStringLength, depth + 1));
  }
  return false;
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate the body is a plain object
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Validate structure and prevent malicious input
    if (!validateSettingsObject(body)) {
      return NextResponse.json(
        { error: "Invalid settings data" },
        { status: 400 }
      );
    }

    const settings = await updateSiteSettings(body, session.user.email || undefined);
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Error updating site settings:", error);
    return NextResponse.json(
      { error: "Failed to update site settings" },
      { status: 500 }
    );
  }
}
