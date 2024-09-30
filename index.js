const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    getDevice,
    fetchLatestBaileysVersion,
    jidNormalizedUser,
    getContentType,
    generateWAMessageFromContent,
    prepareWAMessageMedia,
    proto
} = require('@whiskeysockets/baileys')
const fs = require('fs')
const P = require('pino')
const config = require('./config')
const qrcode = require('qrcode-terminal')
const NodeCache = require('node-cache')
const util = require('util')

const {
    getBuffer,
    getGroupAdmins,
    getRandom,
    h2k,
    isUrl,
    Json,
    runtime,
    sleep,
    fetchJson,
    fetchBuffer,
    getFile
} = require('./lib/functions')
const {
    sms,
    downloadMediaMessage
} = require('./lib/msg')
const axios = require('axios')
const {
    File
} = require('megajs')
const path = require('path')

const msgRetryCounterCache = new NodeCache()

const ownerNumber = config.OWNER;


//===================SESSION============================
if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
    if (config.SESSION_ID) {
      const sessdata = config.SESSION_ID.replace("BLACK-PANTHER=", "")
      const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
      filer.download((err, data) => {
        if (err) throw err
        fs.writeFile(__dirname + '/auth_info_baileys/creds.json', data, () => {
          console.log("Session download completed !!")
        })
      })
    }
  }
// <<==========PORTS===========>>
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
//====================================
async function connectToWA() {
    const {
        version,
        isLatest
    } = await fetchLatestBaileysVersion()
    console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)
    const {
        state,
        saveCreds
    } = await useMultiFileAuthState(__dirname + '/auth_info_baileys/')
    const conn = makeWASocket({
        logger: P({
            level: "fatal"
        }).child({
            level: "fatal"
        }),
        printQRInTerminal: true,
        generateHighQualityLinkPreview: true,
        auth: state,
        defaultQueryTimeoutMs: undefined,
        msgRetryCounterCache
    })

    conn.ev.on('connection.update', async (update) => {
        const {
            connection,
            lastDisconnect
        } = update
        if (connection === 'close') {
            if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
                connectToWA()
            }
        } else if (connection === 'open') {

            console.log('Installing plugins 🔌... ')
            const path = require('path');
            fs.readdirSync("./plugins/").forEach((plugin) => {
                if (path.extname(plugin).toLowerCase() == ".js") {
                    require("./plugins/" + plugin);
                }
            });
            console.log('Plugins installed ✅')           
            console.log('Bot connected ✅')
            await conn.sendMessage("94774500937@s.whatsapp.net", {
                text: "Connected to whatsapp"
            })
        }
    })


    conn.ev.on('creds.update', saveCreds)
    conn.ev.on('messages.upsert', async (mek) => {
        try {
            mek = mek.messages[0]
            if (!mek.message) return
            mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return
            const m = sms(conn, mek)
            const type = getContentType(mek.message)
            const content = JSON.stringify(mek.message)
            const from = mek.key.remoteJid
            const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
            const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text :(type == 'interactiveResponseMessage' ) ? mek.message.interactiveResponseMessage  && mek.message.interactiveResponseMessage.nativeFlowResponseMessage && JSON.parse(mek.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson) && JSON.parse(mek.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id :(type == 'templateButtonReplyMessage' )? mek.message.templateButtonReplyMessage && mek.message.templateButtonReplyMessage.selectedId  : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
             const prefix = config.PREFIX;
            const isCmd = body.startsWith(prefix)
            const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
            const args = body.trim().split(/ +/).slice(1)
            const q = args.join(' ')
            const isGroup = from.endsWith('@g.us')
            const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
            const senderNumber = sender.split('@')[0]
            const botNumber = conn.user.id.split(':')[0]
            const pushname = mek.pushName || 'Sin Nombre'
            const developers = '94774500937'
            const isbot = botNumber.includes(senderNumber)
            const isdev = developers.includes(senderNumber)
            const isMe = isbot ? isbot : isdev
            const sadas = '94774500937'
const isSadas = sadas?.includes(senderNumber)
 const isOwner = ownerNumber.includes(senderNumber) || isMe
            const botNumber2 = await jidNormalizedUser(conn.user.id); 
            const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
            const groupName = isGroup ? groupMetadata.subject : ''
            const participants = isGroup ? await groupMetadata.participants : ''
            const groupAdmins = isGroup ? await getGroupAdmins(participants) : ''
            const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false
            const isreaction = m.message.reactionMessage ? true : false

            const isAdmins = isGroup ? groupAdmins.includes(sender) : false
            const isAnti = (teks) => {
                let getdata = teks
                for (let i = 0; i < getdata.length; i++) {
                    if (getdata[i] === from) return true
                }
                return false
            }
            const reply = async (teks) => {
                return await conn.sendMessage(from, {
                    text: teks,contextInfo: {
                        mentionedjid: [m.sender],
                        forwardingScore: 999,
                        isForwarded: true,
                                      forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363192956026815@newsletter',
                        newsletterName: "Ｄａｒｋ Ｎｅｏｎ Ｃｙｂｅｒｚ 🅥",
                        serverMessageId: 127,
                                      },
                                  externalAdReply:{
                    title: '😼ＫＥＮＺＩ-ＭＤ V2🤍' ,
                    body: `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴀʀᴋɴᴇᴏɴᴄʏʙᴇʀꜱ`,
                    thumbnail: await getBuffer("https://github.com/Darksadas/sadasdb/blob/main/SADAS.jpeg"),
                    mediaType:2,
                    mediaUrl: "https://github.com/shashikalanipuni05",
                                  }
                                    
                                        }}, 
        
                                                      
                        {
                            quoted: mek
                        })
                    }
                

            
            conn.edit = async (mek, newmg) => {
                await conn.relayMessage(from, {
                    protocolMessage: {
                        key: mek.key,
                        type: 14,
                        editedMessage: {
                            conversation: newmg
                        }
                    }
                }, {})
            }
            conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
                let mime = '';
                let res = await axios.head(url)
                mime = res.headers['content-type']
                if (mime.split("/")[1] === "gif") {
                    return conn.sendMessage(jid, {
                        video: await getBuffer(url),
                        caption: caption,
                        gifPlayback: true,
                        ...options
                    }, {
                        quoted: quoted,
                        ...options
                    })
                }
                let type = mime.split("/")[0] + "Message"
                if (mime === "application/pdf") {
                    return conn.sendMessage(jid, {
                        document: await getBuffer(url),
                        mimetype: 'application/pdf',
                        caption: caption,
                        ...options
                    }, {
                        quoted: quoted,
                        ...options
                    })
                }
                if (mime.split("/")[0] === "image") {
                    return conn.sendMessage(jid, {
                        image: await getBuffer(url),
                        caption: caption,
                        ...options
                    }, {
                        quoted: quoted,
                        ...options
                    })
                }
                if (mime.split("/")[0] === "video") {
                    return conn.sendMessage(jid, {
                        video: await getBuffer(url),
                        caption: caption,
                        mimetype: 'video/mp4',
                        ...options
                    }, {
                        quoted: quoted,
                        ...options
                    })
                }
                if (mime.split("/")[0] === "audio") {
                    return conn.sendMessage(jid, {
                        audio: await getBuffer(url),
                        caption: caption,
                        mimetype: 'audio/mpeg',
                        ...options
                    }, {
                        quoted: quoted,
                        ...options
                    })
                }
            }



















    // ==================== owner reacts ======================== 

        if(isdev){
        if(!isreaction){
           // await conn.sendMessage(from, { react: { text: '🥹', key: mek.key } });
           // await conn.sendMessage(from, { react: { text: '😉', key: mek.key } });
           // await conn.sendMessage(from, { react: { text: '😼', key: mek.key } });
           // await conn.sendMessage(from, { react: { text: '😸', key: mek.key } });
           // await conn.sendMessage(from, { react: { text: '🐲', key: mek.key } });
           // await conn.sendMessage(from, { react: { text: '🐦', key: mek.key } });
           // await conn.sendMessage(from, { react: { text: '🔥', key: mek.key } });
           // await conn.sendMessage(from, { react: { text: '💗', key: mek.key } });
            await conn.sendMessage(from, { react: { text: '🖤', key: mek.key } });
            await conn.sendMessage(from, { react: { text: '💛', key: mek.key } });
     await conn.sendMessage(from, { react: { text: '👨🏻‍💻', key: mek.key } });
    
        }
    
    }

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>






    //===============MASSAGE READ==========================

if (body[1] && body[1] == " ") body = body[0] + body.slice(2);
   if (!isCmd&& !isGroup&&    config.AUTO_READ == 'true') return
   await conn.readMessages([mek.key])

//==================ONLY GROUP===============================

 if (config.ONLY_GROUP && !isMe && !isGroup) return


//================ANTI LINK=================================
    
            if (!isAnti&&     config.ANTI_LINK == 'true') return

    {
        if(!isAdmins)
        if (body.match(`chat.whatsapp.com`)) {
          await conn.sendMessage(from, { delete: mek.key })
          await conn.sendMessage(from, { text: '*Anti link detected by group admin ❗*' })

        }
      }

//==============ANTI BAD====================================

const bad = await fetchJson(`https://raw.githubusercontent.com/Darksadas/sadasdb/refs/heads/main/badword.json`)
if (config.ANTI_BAD == "true"){
  if (!isAdmins && !isdev) {
  for (any in bad){
  if (body.toLowerCase().includes(bad[any])){  
    if (!body.includes('tent')) {
      if (!body.includes('docu')) {
        if (!body.includes('https')) {
  if (groupAdmins.includes(sender)) return 
  if (mek.key.fromMe) return   
  await conn.sendMessage(from, { delete: mek.key })  
  await conn.sendMessage(from , { text: '*Bad words detected ❗❗*'})
 
  }}}}}}}









    
//>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<>>>>>>>>>><><><><><><>><><><><><><><><


            conn.sendButtonMessage = async (jid, buttons, quoted, opts = {}) => {

                let header;
                if (opts?.image) {
                    var image = await prepareWAMessageMedia({
                        image: {
                            url: opts && opts.image ? opts.image : ''
                        }
                    }, {
                        upload: conn.waUploadToServer
                    })
                    header = {
                        title: opts && opts.header ? opts.header : '',
                        hasMediaAttachment: true,
                        imageMessage: image.imageMessage,
                    }

                } else {
                    header = {
                        title: opts && opts.header ? opts.header : '',
                        hasMediaAttachment: false,
                    }
                }


                let message = generateWAMessageFromContent(jid, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2,
                            },
                            interactiveMessage: {
                                body: {
                                    text: opts && opts.body ? opts.body : ''
                                },
                                footer: {
                                    text: opts && opts.footer ? opts.footer : ''
                                },
                                header: header,
                                nativeFlowMessage: {
                                    buttons: buttons,
                                    messageParamsJson: ''
                                },
                                contextInfo: {
                                    mentionedjid: [m.sender],
                                    forwardingScore: 999,
                                    isForwarded: true,
                                                  forwardedNewsletterMessageInfo: {
                                    newsletterJid: '120363192956026815@newsletter',
                                    newsletterName: "Ｄａｒｋ Ｎｅｏｎ Ｃｙｂｅｒｚ 🅥",
                                    serverMessageId: 127,
                                                  },
                                              externalAdReply:{
                                title: '😼ＫＥＮＺＩ-ＭＤ V2🤍' ,
                                body: `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴀʀᴋɴᴇᴏɴᴄʏʙᴇʀꜱ`,
                                thumbnail: await getBuffer("https://github.com/Darksadas/sadasdb/blob/main/SADAS.jpeg"),
                                mediaType:2,
                                mediaUrl: "https://github.com/shashikalanipuni05",
                          }
                            
                                }
                            }
                        }
                    }
                }, {
                    quoted: quoted
                })
                await conn.sendPresenceUpdate('composing', jid)
                return await conn.relayMessage(jid, message["message"], {
                    messageId: message.key.id
                })
            }
            //==================================plugin map================================
            const events = require('./command')
            const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
            if (isCmd) {
                const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
                if (cmd) {
                    if (cmd.react) conn.sendMessage(from, {
                        react: {
                            text: cmd.react,
                            key: mek.key
                        }
                    })

                    try {
                        cmd.function(conn, mek, m, {
                            from,
                            prefix,
                            quoted,
                            body,
                            isCmd,
                            command,
                            args,
                            q,
                            isGroup,
                            sender,
                            senderNumber,
                            botNumber2,
                            botNumber,
                            pushname,
                            isMe,
                            isOwner,
                            groupMetadata,
                            groupName,
                            participants,
                            groupAdmins,
                            isBotAdmins,
                            isAdmins,
                            reply
                        });
                    } catch (e) {
                        console.error("[PLUGIN ERROR] ", e);
                    }
                }
            }
            events.commands.map(async (command) => {
                if (body && command.on === "body") {
                    command.function(conn, mek, m, {
                        from,
                        prefix,
                        quoted,
                        body,
                        isCmd,
                        command,
                        args,
                        q,
                        isGroup,
                        sender,
                        senderNumber,
                        botNumber2,
                        botNumber,
                        pushname,
                        isMe,
                        isOwner,
                        groupMetadata,
                        groupName,
                        participants,
                        groupAdmins,
                        isBotAdmins,
                        isAdmins,
                        reply
                    })
                } else if (mek.q && command.on === "text") {
                    command.function(conn, mek, m, {
                        from,
                        quoted,
                        body,
                        isCmd,
                        command,
                        args,
                        q,
                        isGroup,
                        sender,
                        senderNumber,
                        botNumber2,
                        botNumber,
                        pushname,
                        isMe,
                        isOwner,
                        groupMetadata,
                        groupName,
                        participants,
                        groupAdmins,
                        isBotAdmins,
                        isAdmins,
                        reply
                    })
                } else if (
                    (command.on === "image" || command.on === "photo") &&
                    mek.type === "imageMessage"
                ) {
                    command.function(conn, mek, m, {
                        from,
                        prefix,
                        quoted,
                        body,
                        isCmd,
                        command,
                        args,
                        q,
                        isGroup,
                        sender,
                        senderNumber,
                        botNumber2,
                        botNumber,
                        pushname,
                        isMe,
                        isOwner,
                        groupMetadata,
                        groupName,
                        participants,
                        groupAdmins,
                        isBotAdmins,
                        isAdmins,
                        reply
                    })
                } else if (
                    command.on === "sticker" &&
                    mek.type === "stickerMessage"
                ) {
                    command.function(conn, mek, m, {
                        from,
                        prefix,
                        quoted,
                        body,
                        isCmd,
                        command,
                        args,
                        q,
                        isGroup,
                        sender,
                        senderNumber,
                        botNumber2,
                        botNumber,
                        pushname,
                        isMe,
                        isOwner,
                        groupMetadata,
                        groupName,
                        participants,
                        groupAdmins,
                        isBotAdmins,
                        isAdmins,
                        reply
                    })
                }
            });

            switch (command) {
                case 'jid':
                    reply(from)
                    break
                case 'device': {
                    let deviceq = getDevice(mek.message.extendedTextMessage.contextInfo.stanzaId)

                    reply("*He Is Using* _*Whatsapp " + deviceq + " version*_")
                }
                break
                default:
            }
        } catch (e) {
            const isError = String(e)
            console.log(isError)
        }
    })
}
app.get("/", (req, res) => {
    res.send("📟 kenzi md working");
});
app.listen(port, () => console.log(`kenzi Server listening on port http://localhost:${port}`));
setTimeout(async () => {
    await connectToWA()
}, 1000);
