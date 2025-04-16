const { query_async } = require("../utils/pg")
const { fetchWithRetry } = require("../utils/libs")

// find rel="canonical" 
let CHANNELS = [];

let KEYWORDS = [];

async function fetch_data() {
  CHANNELS = [];
  KEYWORDS = [];

  (await query_async(`select keyword from config where platform = 'youtube'`)).forEach(f => {
    (f["keyword"]["CHANNELS"] || []).forEach(t => CHANNELS.push(t["id"]));
    (f["keyword"]["KEYWORDS"] || []).forEach(t => KEYWORDS.push(t));
  })
}

function isQualityContent(item) {
  const title = item.title || "";
  const desc = item.contentSnippet || "";
  const combined = `${title} ${desc}`;

  if (!containsKeywords(combined)) return false;

  return true;
}

function containsKeywords(text) {
  const lowered = text.toLowerCase();
  return KEYWORDS.some((keyword) => lowered.includes(keyword));
}

function formatForDiscord(item) {
  const url = item.link || "";
  const publishedAt = item.pubDate
    ? new Date(item.pubDate).toLocaleString("en-GB", {
      dateStyle: "full",
      timeStyle: "short",
    })
    : "Unknown publish time";

  return {
    content: `
📺 **YouTube Video**: [${item.title}](${url})

🕒 **Published**: ${publishedAt}

🔗 **Watch here**: ${url}
    `.trim(),
  };
}

module.exports = {
  fetch: async () => {

    await fetch_data();

    const allItems = [];

    for (const channelId of CHANNELS) {
      const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      const feed = await fetchWithRetry(feedUrl);
      allItems.push(...feed.items);
    }

    const seen = new Set();
    const uniqueItems = allItems
      .filter(isQualityContent)
      .filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });

    uniqueItems.sort((a, b) => {
      const dateA = new Date(a.pubDate || 0);
      const dateB = new Date(b.pubDate || 0);
      return dateA - dateB;
    });

    return uniqueItems.map(item => ({
      id: item.id,
      title: item.title,
      url: item.link,
      description: item.contentSnippet,
      source: "YouTube",
      discordFormattedMessage: formatForDiscord(item),
    }));
  },
};
