const axios = require("axios");

module.exports = async function sendToDiscord(item, retries = 3) {
  const payload = {
    content: item.discordFormattedMessage.content,
  };

  for (let i = 0; i < retries; i++) {
    try {
      await axios.post(process.env.DISCORD_WEBHOOK_URL, payload);
      console.log(`[✔] Sent: ${item.title}`);
      return;
    } catch (err) {
      const status = err.response?.status;
      const retryAfter = err.response?.headers?.['retry-after'];

      if (status === 429) {
        const waitTime = retryAfter
          ? parseFloat(retryAfter) * 1000
          : 5000;

        console.warn(`[⏳] Rate limited. Retrying in ${waitTime / 1000}s...`);
        await new Promise((res) => setTimeout(res, waitTime));
      } else {
        console.error(`[✘] Failed to send to Discord: ${item.title}`, err.message);
        return;
      }
    }
  }

  console.error(`[✘] Failed after ${retries} retries: ${item.title}`);
};
