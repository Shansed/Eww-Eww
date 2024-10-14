const {cmd , commands} = require('../command')

cmd({
    pattern: "logo1",
    desc: "image.",
    react: "🌌",
    category: "logo",
    use: '.logo1',
    filename: __filename
},
async(conn, mek, m, {from, mnu, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {

try {
    if (!q) return reply('Please provide a name');
    await conn.sendMessage(from, { 
        image: { url: `https://dummyimage.com/600x400/&text=${q}` }, 
        caption: '> *°⏰ [  𝗕𝗬  © Ｄａｒｋ < | | > Ｎｅｏｎ Ｃｙｂｅｒｚ ヤ • 🎉 ]*' 
    }, {quoted: mek});

} catch (e) {
    console.log(e);
    reply(`${e}`);
}
})
