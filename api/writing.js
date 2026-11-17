// Latest Substack posts for the "Lately" block. Cached at the edge for an
// hour, so Substack sees at most a request an hour per region.

const FEED = process.env.SUBSTACK_FEED_URL || "https://joshualeyva.substack.com/feed";
const LIMIT = 3;

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", "#39": "'" };

function text(block, tag) {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  if (!match) return "";
  return match[1]
    .replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, "$1")
    .replace(/&(#?\w+);/g, (whole, name) => ENTITIES[name] ?? whole)
    .trim();
}

/** Pulls title, link, and date out of an RSS feed. Skips anything without a https link. */
export function parseFeed(xml, limit = LIMIT) {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  return items
    .map((item) => {
      const date = new Date(text(item, "pubDate"));
      return {
        title: text(item, "title"),
        url: text(item, "link"),
        date: Number.isNaN(date.getTime()) ? null : date.toISOString(),
      };
    })
    .filter((post) => post.title && /^https:\/\//.test(post.url))
    .slice(0, limit);
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ posts: [] });
  }

  try {
    const response = await fetch(FEED, {
      headers: { Accept: "application/rss+xml, application/xml" },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`feed_${response.status}`);
    const posts = parseFeed(await response.text());
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).json({ posts });
  } catch (error) {
    console.error("writing: feed unavailable", error);
    res.setHeader("Cache-Control", "public, s-maxage=300");
    return res.status(200).json({ posts: [] });
  }
}
