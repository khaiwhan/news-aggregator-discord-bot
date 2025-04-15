const axios = require("axios");

module.exports = {
  fetch: async () => {
    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    };

    const res = await axios.get(
      "https://api.github.com/search/repositories?q=topic:frontend&sort=updated&order=desc&per_page=5",
      { headers }
    );

    return res.data.items.map((repo) => ({
      id: repo.id.toString(),
      title: repo.full_name,
      url: repo.html_url,
      description: repo.description,
      source: "GitHub",
    }));
  },
};