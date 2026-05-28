/**
 * Best-effort resolver for image URLs the user pastes into the admin form.
 *
 * The common gotcha is ImgBB: people copy `https://ibb.co/<id>` (the share
 * page) instead of the direct asset URL `https://i.ibb.co/<id>/<file>.<ext>`.
 * The share page is HTML, so `<img>` and Next/Image silently fail.
 *
 * Strategy:
 *  1. Direct/CDN URLs (`i.ibb.co`, files with image extensions) → return as-is.
 *  2. Known share URL → fetch the page once and read `<meta property="og:image">`.
 *  3. Falls back to the original URL on any failure (so save never blocks).
 */

const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|avif|svg|bmp|ico)(\?.*)?$/i;
const IMGBB_SHARE_RE = /^https?:\/\/ibb\.co\/([\w-]+)\/?$/i;

const IMGBB_OVERRIDES: Record<string, string> = {
  "https://ibb.co/27PHRhmM":
    "https://i.ibb.co/fYtLZFBN/Screenshot-2026-05-28-at-2-41-14-PM.png",
  "https://ibb.co/3yC3jyNP": "https://i.ibb.co/8D7CfD5Q/pro.jpg",
  "https://ibb.co/j9ZXTtW3": "https://i.ibb.co/Q7jwf0CY/cleark.png",
};

/** True when the URL is an ImgBB viewer page, not a direct CDN asset. */
export const isImgBbShareUrl = (url: string | null | undefined) =>
  !!url && IMGBB_SHARE_RE.test(url.trim().replace(/\/$/, ""));

type WithCoverUrl = { coverUrl: string | null };

export async function withResolvedCoverUrl<T extends WithCoverUrl>(
  item: T
): Promise<T> {
  const resolved = (await resolveImageUrl(item.coverUrl)) ?? null;
  if (resolved === item.coverUrl) return item;
  return { ...item, coverUrl: resolved };
}

export async function withResolvedCoverUrls<T extends WithCoverUrl>(
  items: T[]
): Promise<T[]> {
  return Promise.all(items.map(withResolvedCoverUrl));
}

// Small in-process cache so we don't refetch the same share page repeatedly.
const cache = new Map<string, string>();

const isDirectImage = (url: string) =>
  IMAGE_EXT_RE.test(url) ||
  /i\.ibb\.co/i.test(url) ||
  /res\.cloudinary\.com/i.test(url) ||
  /imagedelivery\.net/i.test(url);

async function fetchOgImage(shareUrl: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(shareUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; emtiaz-bot/1.0)" },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const html = await res.text();
    // Look for <meta property="og:image" content="...">
    const match =
      html.match(
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
      ) ||
      html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
      );
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export const resolveImageUrl = async (
  url: string | null | undefined
): Promise<string | null | undefined> => {
  if (!url) return url;

  const trimmed = url.trim().replace(/\/$/, "");
  if (!trimmed) return null;

  // Static manual overrides win first.
  if (IMGBB_OVERRIDES[trimmed]) return IMGBB_OVERRIDES[trimmed];

  // Already a direct/CDN asset — keep as-is.
  if (isDirectImage(trimmed)) return trimmed;

  // ImgBB share page → resolve to direct CDN URL via og:image.
  if (IMGBB_SHARE_RE.test(trimmed)) {
    const cached = cache.get(trimmed);
    if (cached) return cached;
    const resolved = await fetchOgImage(trimmed);
    if (resolved) {
      cache.set(trimmed, resolved);
      return resolved;
    }
  }

  // Unknown / unresolvable — return original (UI may still render if direct).
  return trimmed;
};
