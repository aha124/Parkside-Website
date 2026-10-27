// Event dates are free text. Scraped events look like "Nov 2, 2026", but the
// admin form accepts anything, so admin-created events show up as
// "Sunday, November 22, 2026", "Oct. 30 - Nov. 1, 2026", "March 5-7, 2026",
// "2026-11-22", etc. `new Date()` handles only some of these, and the old
// parser read the first half of "Oct. 30 - Nov. 1, 2026" as "Oct. 30" with no
// year, which put the event in the past.
//
// These helpers return local-midnight dates, or null when nothing parses.

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

// "Oct. 30", "November 22", "Sept 5"
const MONTH_DAY = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2})(?!\d)/gi;

function isoOrNumeric(s: string): Date | null {
  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return new Date(+iso[1], +iso[2] - 1, +iso[3]);

  const us = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (us) {
    let year = +us[3];
    if (year < 100) year += 2000;
    return new Date(year, +us[1] - 1, +us[2]);
  }
  return null;
}

function years(s: string): number[] {
  return Array.from(s.matchAll(/\b(\d{4})\b/g), (m) => +m[1]);
}

function fallback(s: string): Date | null {
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** First day of the event. */
export function parseEventStart(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;
  const s = dateStr.trim();

  const numeric = isoOrNumeric(s);
  if (numeric) return numeric;

  const match = MONTH_DAY.exec(s);
  MONTH_DAY.lastIndex = 0;
  const ys = years(s);
  if (match && ys.length) {
    return new Date(ys[0], MONTHS[match[1].toLowerCase()], +match[2]);
  }
  return fallback(s);
}

/** Last day of the event (same as the start for single-day events). */
export function parseEventEnd(dateStr: string | undefined): Date | null {
  const start = parseEventStart(dateStr);
  if (!dateStr || !start) return start;
  const s = dateStr.trim();
  const ys = years(s);
  const endYear = ys.length ? ys[ys.length - 1] : start.getFullYear();

  // "Oct. 30 - Nov. 1, 2026" or "Dec 30, 2026 - Jan 2, 2027"
  const monthDays = Array.from(s.matchAll(MONTH_DAY));
  if (monthDays.length > 1) {
    const last = monthDays[monthDays.length - 1];
    const end = new Date(endYear, MONTHS[last[1].toLowerCase()], +last[2]);
    return end >= start ? end : start;
  }

  // "March 5-7, 2026"
  const dayRange = s.match(/\b(\d{1,2})\s*[-–]\s*(\d{1,2}),?\s+\d{4}\b/);
  if (dayRange && monthDays.length === 1) {
    const end = new Date(start.getFullYear(), start.getMonth(), +dayRange[2]);
    return end >= start ? end : start;
  }

  return start;
}

/**
 * An event is past once its last day is over. Events whose date can't be
 * read are never treated as past, so they stay visible rather than vanishing.
 */
export function isEventPast(dateStr: string | undefined, now: Date = new Date()): boolean {
  const end = parseEventEnd(dateStr);
  if (!end) return false;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return end < today;
}

/** Sort key: start time in ms, with unreadable dates sorted last. */
export function eventSortKey(dateStr: string | undefined): number {
  return parseEventStart(dateStr)?.getTime() ?? Number.MAX_SAFE_INTEGER;
}
