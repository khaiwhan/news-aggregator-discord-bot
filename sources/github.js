const { franc } = require("franc");
const { query_async } = require("../utils/pg")
const { fetchWithRetry } = require("../utils/libs")

let GITHUB_REPOS = [];

let FEEDS = [];

async function fetch_data() {
  GITHUB_REPOS = [];
  FEEDS = [];

  (await query_async(`select keyword from config where platform = 'github'`)).forEach(f => {
    (f["keyword"]["GITHUB_REPOS"] || []).forEach(t => GITHUB_REPOS.push(t));
  })

  FEEDS = GITHUB_REPOS.map(repo => ({
    repo,
    url: `https://github.com/${repo}/releases.atom`,
  }));
}

function isThaiOrEnglish(text) {
  const lang = franc(text || "", { minLength: 10 });
  return lang === "tha" || lang === "eng";
}

function isQualityContent(item) {
  const title = item.title || "";
  const desc = item.contentSnippet || "";

  if (!isThaiOrEnglish(title)) return false;
  if (!isThaiOrEnglish(desc)) return false;

  return true;
}

function formatForDiscord(item) {
  const url = item.link;
  const publishedAt = item.pubDate
    ? new Date(item.pubDate).toLocaleString("en-GB", {
      dateStyle: "full",
      timeStyle: "short",
    })
    : "Unknown publish time";

  return {
    content: `
📦 **[${item.title}](${url})**

📁 **Repo**: \`${item.repo}\`

📅 **Released**: ${publishedAt}

🔗 [View Release](${url})
    `.trim(),
  };
}

module.exports = {
  fetch: async () => {

    await fetch_data();

    const allItems = [];

    for (const { repo, url } of FEEDS) {
      const feed = await fetchWithRetry(url);
      const items = (feed.items || []).map(item => ({
        ...item,
        repo,
      }));
      allItems.push(...items);
    }

    const seen = new Set();
    const uniqueItems = allItems
      .filter(isQualityContent)
      .filter(item => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });

    uniqueItems.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));

    return uniqueItems.map(item => ({
      id: item.id,
      title: item.title,
      url: item.link,
      description: item.contentSnippet || "",
      source: "GitHub",
      repo: item.repo,
      discordFormattedMessage: formatForDiscord(item),
    }));
  },
};
