const axios = require("axios");

module.exports = {
  fetch: async () => {
    const PAGE_ID = "your_page_id";
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

    const res = await axios.get(
      `https://graph.facebook.com/${PAGE_ID}/posts?access_token=${accessToken}`
    );

    return (res.data.data || []).slice(0, 5).map((post) => ({
      id: post.id,
      title: "Facebook Post",
      url: `https://www.facebook.com/${post.id}`,
      description: post.message || "",
      source: "Facebook",
    }));
  },
};