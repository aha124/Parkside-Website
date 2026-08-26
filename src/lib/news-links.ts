/**
 * Where a news item's "Read More" should point.
 *
 * Pure and client-safe — no fs or KV — so NewsList and the article page agree
 * on link shape without pulling server code into the browser bundle.
 */

export interface LinkableNewsItem {
  id: string;
  title: string;
  url?: string;
  slug?: string;
}

export function isExternalNewsUrl(url: string | undefined): boolean {
  return typeof url === "string" && /^https?:\/\//i.test(url);
}

/** Turn a headline into a URL-safe slug: "A Decade of Harmony" -> "a-decade-of-harmony". */
export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")   // strip accents
    .replace(/['‘’]/g, "")   // drop apostrophes rather than hyphenating them
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/**
 * A slug not already used by another item, suffixed -2, -3… if needed.
 *
 * Keeps two articles that share a headline from resolving to the same page —
 * silently serving the wrong article is worse than an uglier URL.
 */
export function uniqueNewsSlug(title: string, taken: Iterable<string>): string {
  const base = slugifyTitle(title) || "article";
  const used = new Set(taken);
  if (!used.has(base)) return base;

  for (let n = 2; n < 1000; n++) {
    const candidate = `${base}-${n}`;
    if (!used.has(candidate)) return candidate;
  }
  return `${base}-${Date.now()}`;
}

/**
 * The href for a news item.
 *
 * Scraped items live on parksideharmony.org and keep their external link.
 * Everything else is hosted here, at its slug — or its id when it predates
 * slugs, which still resolves.
 *
 * Never falls back to "/news": that pointed the link at the listing page the
 * reader was already on, which is what "Read More" appeared to do for every
 * admin-written article.
 */
export function getNewsHref(item: LinkableNewsItem): string {
  if (isExternalNewsUrl(item.url)) return item.url as string;

  // Scraped items sometimes carry a bare Drupal path instead of a full URL.
  if (item.url?.startsWith("/node/")) {
    return `https://parksideharmony.org${item.url}`;
  }

  return `/news/${item.slug || item.id}`;
}

/** True when the href leaves this site and should open in a new tab. */
export function isExternalHref(href: string): boolean {
  return isExternalNewsUrl(href);
}

/** Does this URL path segment identify this item? Slug preferred, id still works. */
export function matchesNewsParam(item: LinkableNewsItem, param: string): boolean {
  if (item.id === param) return true;
  if (item.slug && item.slug === param) return true;
  // Items created before slugs were stored still resolve by their headline.
  return !item.slug && slugifyTitle(item.title) === param;
}
