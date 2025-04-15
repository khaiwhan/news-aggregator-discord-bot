const axios = require("axios");

module.exports = {
  fetch: async () => {
    const headers = {
      Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
    };

    const res = await axios.get(
      "https://api.twitter.com/2/tweets/search/recent?query=frontend&max_results=5&tweet.fields=author_id,text",
      { headers }
    );

    return (res.data.data || []).map((tweet) => ({
      id: tweet.id,
      title: `Tweet by ${tweet.author_id}`,
      url: `https://twitter.com/i/web/status/${tweet.id}`,
      description: tweet.text,
      source: "X (Twitter)",
    }));
  },
};