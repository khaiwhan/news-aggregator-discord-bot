const Parser = require("rss-parser");
const { franc } = require("franc");
const parser = new Parser();
const { query_async } = require("../utils/pg")

let TAGS = [];
let FEEDS = [];
let BAD_WORDS = [];

async function fetch_data() {
  (await query_async(`select keyword from config where platform = 'medium'`)).forEach(f => {
    (f["keyword"]["TAGS"] || []).forEach(t => TAGS.push(t));
    (f["keyword"]["BAD_WORDS"] || []).forEach(t => BAD_WORDS.push(t));
  })

  FEEDS = TAGS.map(tag => `https://medium.com/feed/tag/${tag}`)
}

function isThaiOrEnglish(text) {
  const lang = franc(text || "", { minLength: 10 });
  return lang === "tha"
    || lang === "eng";
}

function isQualityContent(item) {
  const minDescLength = 80;
  const title = item.title || "";
  const desc = item.contentSnippet || "";
  const lowered = (title + " " + desc).toLowerCase();

  if (desc.length < minDescLength) return false;
  if (!isThaiOrEnglish(title + " " + desc)) return false;
  if (BAD_WORDS.some((word) => lowered.includes(word))) return false;

  return true;
}

function formatForDiscord(item) {
  const url = item.link || item.url || "";
  const publishedAt = item.pubDate
    ? new Date(item.pubDate).toLocaleString("en-GB", {
      dateStyle: "full",
      timeStyle: "short",
    })
    : "Unknown publish time";

  return {
    content: `
💡 **Title**: [${item.title}](${url})

🕒 **Published**: ${publishedAt}

🔍 **Description**: ${item.contentSnippet}

🔗 **Full Article**: [Read More](${url})
    `.trim(),
  };
}

async function fetchWithRetry(url, retries = 10, delayMs = 61000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await parser.parseURL(url);
    } catch (err) {
      console.warn(`⚠️ Attempt ${i + 1} failed for ${url}: ${err.message}`);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else {
        console.error(`❌ All attempts failed for ${url}`);
      }
    }
  }
  return { items: [] };
}

module.exports = {
  fetch: async () => {

    await fetch_data();

    const allItems = [];

    for (const feedURL of FEEDS) {
      const feed = await fetchWithRetry(feedURL);
      allItems.push(...feed.items);
    }

    const seen = new Set();
    const uniqueQualityItems = allItems
      .filter(isQualityContent)
      .filter((item) => {
        if (seen.has(item.guid)) return false;
        seen.add(item.guid);
        return true;
      });

    return uniqueQualityItems.sort((a, b) => {
      const timeA = Date.parse(a.pubDate);
      const timeB = Date.parse(b.pubDate);
      return timeA - timeB;
    }).map(item => ({
      id: item.guid,
      title: item.title,
      url: item.link,
      description: item.contentSnippet,
      source: "Medium",
      discordFormattedMessage: formatForDiscord(item),
    }));
  },
};