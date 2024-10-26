const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });
function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID === undefined ? '' : process.env.SESSION_ID,
ONLY_GROUP: process.env.ONLY_GROUP === undefined ? 'false' : process.env.ONLY_GROUP,
ONLY_ME: process.env.ONLY_ME === undefined ? 'false' : process.env.ONLY_ME,
STATUS_VIEW: process.env.STATUS_VIEW === undefined ? 'true' : process.env.STATUS_VIEW,
ALWAYS_ONLINE: process.env.ADDRESSES === undefined ? 'false' : process.env.ADDRESSES,
OMDB_API_KEY: process.env.OMDB_API_KEY || "76cb7f39",
AUTO_TYPING: process.env.AUTO_TYPING === undefined ? 'false' : process.env.AUTO_TYPING,
AUTO_RECORDING: process.env.AUTO_RECORDING === undefined ? 'true' : process.env.AUTO_RECORDING,
ALIVE_IMG : process.env.ALIVE_IMG || "https://telegra.ph/file/08ce20a843b7650a296e7.jpg",
ALIVE: process.env.ALIVE === undefined ? `Hello im alive now !!` : process.env.ALIVE,
OWNER: process.env.OWNER === undefined ? `94774500937` : process.env.OWNER,
FOOTER: process.env.FOOTER=== undefined ? 'Qᴜᴇᴇɴ-ᴋᴇɴᴢɪ ᴍᴅ ᴠ2': process.env.FOOTER,
MAX_SIZE: process.env.MAX_SIZE === undefined ? '1500': process.env.MAX_SIZE,
LOGO: process.env.LOGO === undefined ? `https://8030.us.kg/file/mKXIMtf1PF1i.jpg` : process.env.LOGO,
ANTI_DELETE : process.env.ANTI_DELETE === undefined ? 'true' : process.env.ANTI_DELETE,
DELETEMSGSENDTO : process.env.DELETEMSGSENDTO === undefined ? '94774500937' : process.env.DELETEMSGSENDTO
}
