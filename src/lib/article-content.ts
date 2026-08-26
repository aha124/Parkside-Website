/**
 * Turns an article's plain-text content into renderable blocks.
 *
 * Authors paste YouTube links straight into the body — usually on their own
 * line under a label — so those links become players where they were written,
 * rather than sitting as raw URLs the reader has to copy out. Any number of
 * videos can appear in one article, each keeping its place in the text.
 *
 * Pure and dependency-free. Returns data, never HTML: the article page builds
 * React elements from these blocks, so nothing here is ever injected as markup.
 */

export interface TextSegment {
  type: "text";
  text: string;
}

export interface LinkSegment {
  type: "link";
  href: string;
  text: string;
}

export type Segment = TextSegment | LinkSegment;

export interface ParagraphBlock {
  type: "paragraph";
  segments: Segment[];
}

export interface VideoBlock {
  type: "video";
  videoId: string;
  url: string;
}

export type ContentBlock = ParagraphBlock | VideoBlock;

// A YouTube id is exactly 11 characters of [A-Za-z0-9_-].
const YOUTUBE_ID = "[A-Za-z0-9_-]{11}";

const YOUTUBE_PATTERNS = [
  // youtu.be/ID  — the "Copy link" form, usually carrying ?si=…
  new RegExp(`^https?://(?:www\\.)?youtu\\.be/(${YOUTUBE_ID})`, "i"),
  // youtube.com/watch?v=ID
  new RegExp(`^https?://(?:www\\.)?youtube\\.com/watch\\?(?:.*&)?v=(${YOUTUBE_ID})`, "i"),
  // youtube.com/embed/ID and /shorts/ID and /live/ID
  new RegExp(`^https?://(?:www\\.)?youtube(?:-nocookie)?\\.com/(?:embed|shorts|live|v)/(${YOUTUBE_ID})`, "i"),
];

/** Any http(s) URL, stopping before trailing punctuation that reads as prose. */
const URL_PATTERN = /https?:\/\/[^\s<>"']+/g;

/** Trailing characters that are almost always sentence punctuation, not URL. */
function trimTrailingPunctuation(url: string): string {
  let trimmed = url;
  while (/[.,;:!?)\]}]$/.test(trimmed)) {
    // Keep a closing paren that has a matching opener inside the URL.
    if (trimmed.endsWith(")") && (trimmed.match(/\(/g) || []).length > (trimmed.match(/\)/g) || []).length - 1) {
      break;
    }
    trimmed = trimmed.slice(0, -1);
  }
  return trimmed;
}

/** The YouTube video id in this URL, or null if it isn't a YouTube link. */
export function getYouTubeId(url: string): string | null {
  const cleaned = trimTrailingPunctuation(url.trim());
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = cleaned.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/** Split one line into text and link segments, keeping the text intact. */
function segmentLine(line: string): Segment[] {
  const segments: Segment[] = [];
  let cursor = 0;

  for (const match of line.matchAll(URL_PATTERN)) {
    const raw = match[0];
    const href = trimTrailingPunctuation(raw);
    const start = match.index ?? 0;

    if (start > cursor) {
      segments.push({ type: "text", text: line.slice(cursor, start) });
    }
    segments.push({ type: "link", href, text: href });
    // Anything trimmed off the URL is punctuation and belongs to the text.
    cursor = start + href.length;
  }

  if (cursor < line.length) {
    segments.push({ type: "text", text: line.slice(cursor) });
  }
  return segments;
}

/**
 * Parse article body text into paragraphs and video embeds.
 *
 * Blank lines separate paragraphs, matching how the admin textarea is written.
 * A line containing a YouTube link ends the current paragraph, keeps whatever
 * else that line said (its label), and emits the player directly beneath it.
 */
export function parseArticleContent(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  if (!content?.trim()) return blocks;

  for (const rawParagraph of content.trim().split(/\n\s*\n/)) {
    let pending: string[] = [];

    const flush = () => {
      const text = pending.join("\n").trim();
      pending = [];
      if (!text) return;
      blocks.push({ type: "paragraph", segments: segmentLine(text) });
    };

    for (const line of rawParagraph.split("\n")) {
      const videoUrl = (line.match(URL_PATTERN) || []).find((u) => getYouTubeId(u));

      if (!videoUrl) {
        pending.push(line);
        continue;
      }

      // Keep the label that introduced the video, drop the bare URL, then
      // emit the player where the link was written.
      const label = line.replace(videoUrl, "").replace(/[\s\-–—:]+$/, "").trim();
      if (label) pending.push(label);
      flush();

      blocks.push({
        type: "video",
        videoId: getYouTubeId(videoUrl) as string,
        url: trimTrailingPunctuation(videoUrl),
      });
    }

    flush();
  }

  return blocks;
}
