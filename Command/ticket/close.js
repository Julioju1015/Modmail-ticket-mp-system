const { MessageEmbed } = require("discord.js");
const haste = require('hastebin-save');
const moment = require("moment")
const { readFileSync } = require("fs")
const db = JSON.parse(readFileSync("config.json"))

module.exports.run = async (client, message, args) => {
    if (message.guild) {
        if (message.channel.parent.name.toLowerCase().startsWith("ticket")) {
            const text = [...message.channel.messages.cache.entries()].map(([msgId, msg]) => `${msg.author.client ? msg.embeds.length > 0 ? `[${msg.embeds[0].author.name}] ${msg.embeds[0].description}` : `[Inconnu] ${msg.content ? msg.content : "Erreur"}` : `STAFF [${msg.author.tag}] ${msg.content}`}`).join("\n")
                const info = JSON.parse(message.channel.topic)
                message.channel.delete()
                client.users.cache.get(info.auth_id).send({
                    embed: new MessageEmbed()
                        .setAuthor("TICKET CLOSE")
                        .setDescription("Your ticket has been close")
                })
                client.channels.cache.get(db.log_channel).send({
                    embed: new MessageEmbed()
                        .setAuthor("Ticket close")
                        .addFields(
                            { name: "Ticket created by", value: client.users.cache.get(info.auth_id).tag },
                            { name: "At", value: moment(Date.now()).local("fr").format("HH:mm DD/MM/YYYY") + " [FR UTC]" },
                            { name: "Closed by", value: message.author.tag }
                        )
                })
            }
            
        }
    }

