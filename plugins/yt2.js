// ----- *Y T S O N G D L*-----
//------ *BY PINK VENOM OFC*----
// ----- *https://whatsapp.com/channel/0029Vaa1t6l5q08V1jdCS33q*

const config = require('../config')
const fetch = require('node-fetch')
const {
    getBuffer,
    getGroupAdmins,
    getRandom,
    getsize,
    h2k,
    isUrl,
    Json,
    runtime,
    sleep,
    fetchJson
} = require('../lib/functions')
const {
    cmd,
    commands
} = require('../command')

let foot = config.FOOTER

async function dlyta(url) {
        try {

            const maxat = 10;

            for (let attempt = 0; attempt < maxat; attempt++) {
                const gala = await fetch(`https://api-pink-venom.vercel.app/api/ytdl?url=${url}`);

                const mala = await gala.json();

                if (mala.result.download_url) {
                    return {
                        status: true,
                        dl_link: mala.result.download_url
                        }
                    };
                }

                await new Promise(resolve => setTimeout(resolve, 4000));
            return { status: false, msg: 'error' };

        } catch (e) {
            console.error(e);
            return { status: false, msg: e.message };
        }
    }

cmd({
    pattern: "yta2",
    alias: ["song2", "ytmp4", "ytsong", "lagu"],
    react: "🎶",
    use: ".song2 <name>",
    dontAddCommandList: true,
    filename: __filename
},
    async (conn, mek, m, { from, q, reply }) => {
        try {
            if (!q) return await reply('*Need a YouTube URL!*');

            const prog = await dlyta(q);

            await conn.sendMessage(from, { audio: { url: prog.dl_link }, mimetype: 'audio/mpeg' }, { quoted: mek });
        } catch (e) {
            console.log('First attempt failed:', e);

            try {
                const prog = await dlyta(q);

            await conn.sendMessage(from, { audio: { url: prog.dl_link }, mimetype: 'audio/mpeg' }, { quoted: mek });
            } catch (error) {
                console.log('Second attempt failed:', error);
                await reply('*Failed to process the request. Please try again later!*');
            }
        }
    }
)
