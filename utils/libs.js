const Parser = require("rss-parser");
const parser = new Parser();

async function fetchWithRetry(url, delayMs = 60000) {
    for (let i = 0; true; i++) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log(`🚀 RSS Fetch : ${url}`)
            return await parser.parseURL(url);
        }
        catch (err) {
            const sec = Math.round(delayMs / 1000)

            for (let j = 0; j < sec; j++) {
                // process.stdout.write(`\r⚠️ Attempt ${i + 1} failed for ${url}: ${err.message} wait ${j + 1}/${(sec)} seconds`);
                console.log(`\r⚠️ Attempt ${i + 1} failed for ${url}: ${err.message} wait ${j + 1}/${(sec)} seconds`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            console.log(`\r⚠️ Attempt ${i + 1} failed for ${url}: ${err.message} wait ${(sec)}/${sec} seconds`);

            delayMs *= 2
        }
    }
}

function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    parts.push(`${String(seconds).padStart(2, '0')}s`);

    return parts.join(' ');
}


module.exports = { fetchWithRetry, formatDuration }