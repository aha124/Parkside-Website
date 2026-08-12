import type { FeaturedBanner } from "@/types/admin";

/**
 * Validation for admin-submitted banner data, shared by the create and update
 * routes so the two can't drift apart.
 */

const MAX_LEAD_IN = 100;
const MAX_HEADLINE = 120;
const MAX_SUBLINE = 200;
const MAX_LINK_LABEL = 40;
const MAX_URL = 2000;

type BannerFields = Omit<FeaturedBanner, "id" | "createdAt" | "updatedAt" | "createdBy">;

export type ValidationResult =
  | { ok: true; value: BannerFields }
  | { ok: false; error: string };

/**
 * Accepts a site-relative path or an https:// URL.
 *
 * Rejects protocol-relative "//evil.com" (which browsers treat as external) and
 * anything with a scripting scheme, since this value lands in an href.
 */
function isValidLink(value: string): boolean {
  if (value.startsWith("/")) return !value.startsWith("//");
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

/** True only for a real calendar day: rejects both "06-13-2026" and "2026-02-31". */
function isValidCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateBannerInput(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body" };
  }

  const input = body as Record<string, unknown>;

  const headline = asTrimmedString(input.headline);
  if (!headline) {
    return { ok: false, error: "Headline is required" };
  }
  if (headline.length > MAX_HEADLINE) {
    return { ok: false, error: `Headline must be ${MAX_HEADLINE} characters or less` };
  }

  const leadIn = asTrimmedString(input.leadIn);
  if (leadIn.length > MAX_LEAD_IN) {
    return { ok: false, error: `Lead-in must be ${MAX_LEAD_IN} characters or less` };
  }

  const subline = asTrimmedString(input.subline);
  if (subline.length > MAX_SUBLINE) {
    return { ok: false, error: `Date/location line must be ${MAX_SUBLINE} characters or less` };
  }

  const linkLabel = asTrimmedString(input.linkLabel);
  if (linkLabel.length > MAX_LINK_LABEL) {
    return { ok: false, error: `Button text must be ${MAX_LINK_LABEL} characters or less` };
  }

  const imageUrl = asTrimmedString(input.imageUrl);
  if (!imageUrl) {
    return { ok: false, error: "A background image is required" };
  }
  if (imageUrl.length > MAX_URL) {
    return { ok: false, error: "Background image URL is too long" };
  }

  const logoUrl = asTrimmedString(input.logoUrl);
  if (logoUrl.length > MAX_URL) {
    return { ok: false, error: "Logo URL is too long" };
  }

  const linkUrl = asTrimmedString(input.linkUrl);
  if (!linkUrl) {
    return { ok: false, error: "A link is required — where should the banner send visitors?" };
  }
  if (linkUrl.length > MAX_URL || !isValidLink(linkUrl)) {
    return {
      ok: false,
      error: 'Link must be a page on this site (starting with "/") or an https:// address',
    };
  }

  const startDate = asTrimmedString(input.startDate);
  if (startDate && !isValidCalendarDate(startDate)) {
    return { ok: false, error: "Start date must be a valid date" };
  }

  const endDate = asTrimmedString(input.endDate);
  if (endDate && !isValidCalendarDate(endDate)) {
    return { ok: false, error: "End date must be a valid date" };
  }

  if (startDate && endDate && endDate < startDate) {
    return { ok: false, error: "End date must be on or after the start date" };
  }

  const rawPriority = Number(input.priority);
  const priority = Number.isFinite(rawPriority) ? Math.trunc(rawPriority) : 0;
  if (priority < 0 || priority > 999) {
    return { ok: false, error: "Priority must be between 0 and 999" };
  }

  return {
    ok: true,
    value: {
      leadIn: leadIn || undefined,
      headline,
      subline: subline || undefined,
      imageUrl,
      logoUrl: logoUrl || undefined,
      linkUrl,
      linkLabel: linkLabel || undefined,
      isActive: Boolean(input.isActive),
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      priority,
    },
  };
}
