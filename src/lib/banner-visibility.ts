import type { FeaturedBanner } from "@/types/admin";

/**
 * Visibility rules for homepage featured banners.
 *
 * Pure functions with no KV or React dependency, so the public API route, the
 * admin list badges, and the homepage component all agree on what "live" means.
 */

export type BannerStatus = "live" | "scheduled" | "expired" | "off";

/** The chorus is in Hershey, PA — dates are meant as local calendar days. */
const TIMEZONE = "America/New_York";

/**
 * Today's date as "YYYY-MM-DD" in the chorus's timezone.
 *
 * Banner dates are plain calendar days, so comparing them as strings against a
 * local "today" avoids the off-by-one where a banner set to end June 13 would
 * vanish at 8pm on the 12th (UTC midnight) or linger a day too long.
 */
export function getLocalToday(now: Date = new Date()): string {
  // "en-CA" formats as YYYY-MM-DD, which sorts correctly as a string.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/**
 * Where a banner sits relative to its schedule.
 *
 * - `off`       — switched off in admin, dates irrelevant
 * - `scheduled` — switched on, but its start date hasn't arrived
 * - `expired`   — switched on, but its end date has passed
 * - `live`      — currently eligible to render
 */
export function getBannerStatus(
  banner: Pick<FeaturedBanner, "isActive" | "startDate" | "endDate">,
  today: string = getLocalToday()
): BannerStatus {
  if (!banner.isActive) return "off";
  if (banner.startDate && today < banner.startDate) return "scheduled";
  // endDate is inclusive: a banner ending June 13 still shows all of June 13.
  if (banner.endDate && today > banner.endDate) return "expired";
  return "live";
}

export function isBannerLive(
  banner: Pick<FeaturedBanner, "isActive" | "startDate" | "endDate">,
  today: string = getLocalToday()
): boolean {
  return getBannerStatus(banner, today) === "live";
}

/**
 * The single banner the homepage should render, or null when none is live.
 *
 * Highest priority wins; ties break toward the most recently updated so the
 * banner someone just edited is the one they see.
 */
export function selectActiveBanner(
  banners: FeaturedBanner[],
  today: string = getLocalToday()
): FeaturedBanner | null {
  const live = banners.filter((banner) => isBannerLive(banner, today));
  if (live.length === 0) return null;

  return live.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  })[0];
}
