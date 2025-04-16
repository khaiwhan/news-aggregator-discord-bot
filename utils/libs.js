const Parser = require("rss-parser");
const parser = new Parser();

async function fetchWithRetry(url, delayMs = 61000) {
    for (let i = 0; true; i++) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            return await parser.parseURL(url);
        }
        catch (err) {
            console.warn(`⚠️ Attempt ${i + 1} failed for ${url}: ${err.message} wait ${(delayMs / 1000).toFixed(2)} seconds`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            delayMs *= 2
        }
    }
}

module.exports = { fetchWithRetry }