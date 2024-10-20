const { cmd, commands } = require('../command');
const xnxx = require("xnxx-dl");
const { fetchJson, getBuffer } = require('../lib/functions');

// XNXX video download command
cmd({
    pattern: "xnxx1",
    desc: "Downloads a video from XNXX",
    use: ".xnxx1 <search_term>",
    react: "📥",
    category: "downloads",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, q, reply }) => {
    const searchTerm = q.trim();
    if (!searchTerm) return reply(`Please provide a search term`);

    reply(`Searching For Your Video...`);
    try {
        // Search for the video and download
        const videoInfo = await xnxx.download(searchTerm);
        if (!videoInfo || !videoInfo.link_dl) {
            return await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        }

        reply(`Downloading video...`);
        const videoUrl = videoInfo.link_dl;
        await conn.sendMessage(
            from,
            { video: { url: videoUrl }, caption: '*Queen Spriky MD*', mimetype: 'video/mp4' }, 
            { quoted: mek }
        );

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply(`Error: ${e.message}`);
    }
});

module.exports = {};
