const config = require('../config')
const {cmd , commands} = require('../command')
const { fetchJson } = require('../lib/functions')

cmd({
    pattern: "genimg",
    desc: "Ai image.",
    react: "🧠",
    category: "ai",
    use: '.genimg',
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

await conn.sendMessage(from,{image :{ url: `https://api.vihangayt.com/ai/stablediff?prompt=${q}&negprompt=not%20hd,%20watermark` },caption: '> *SHADOW MD💗' },{quoted:mek});

}catch(e){
console.log(e)
reply(`${e}`)
}
})

//======Wallpaper=====

cmd({
    pattern: "gemini",
    desc: "Ai chat.",
    react: "🧠",
    category: "ai",
    use: '.gemini',
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

let res = await fetchJson(`https://api.vihangayt.com/ai/gemini?q=${q}`)
//----------------------------------
let data = res.data

await reply(data.response)

}catch(e){
console.log(e)
reply(`${e}`)
}
})

//======gpt4=======

cmd({
    pattern: "gpt",
    desc: "Ai chat.",
    react: "🧠",
    category: "ai",
    use: '.gpt',
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

let data = await fetchJson(`https://api.vihangayt.com/ai/gpt?q=${q}`)
return reply(`${data.data}`)
}catch(e){
console.log(e)
reply(`${e}`)
}
})

cmd({
    pattern: "lamda",
    desc: "Ai chat.",
    react: "🧠",
    category: "ai",
    use: '.lamda',
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

let data = await fetchJson(`https://api.vihangayt.com/ai/lamda?q=${q}`)
return reply(`${data.data}`)
}catch(e){
console.log(e)
reply(`${e}`)
}
})

cmd({
    pattern: "lalaland",
    desc: "Ai chat.",
    react: "🧠",
    category: "ai",
    use: '.lalaland',
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

let data = await fetchJson(`https://api.vihangayt.com/ai/lalaland?q=${q}`)
return reply(`${data.data}`)
}catch(e){
console.log(e)
reply(`${e}`)
}
})
