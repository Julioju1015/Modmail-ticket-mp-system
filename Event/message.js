const { readFileSync } = require("fs")
const { MessageEmbed } = require("discord.js")
const moment = require("moment")
const db = JSON.parse(readFileSync("config.json"))
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return JSON.parse(str);;
}
module.exports = (client, message) => {
    let guild_support = client.guilds.cache.get(db.support_id)
    if (message.author.bot) return
    if (message.content.startsWith("!")) {
        let messageArray = message.content.slice("-".length).split(" ")
        let cmd = messageArray.shift()
        let args = messageArray.slice(0)
        if (!client.commands.has(cmd)) return
        return client.commands.get(cmd).run(client, message, args)

    }
    if (!message.guild) {
        let embed = new MessageEmbed()
        if (guild_support.channels.cache.find(e => IsJsonString(e.topic) && Object.keys(JSON.parse(e.topic)).find(e => e == "auth_id") &&  JSON.parse(e.topic)["auth_id"] == message.author.id)) {
            (message.attachments.size > 0) ? embed.setImage(message.attachments.first().attachment) : null
            guild_support.channels.cache.find(e => IsJsonString(e.topic) && Object.keys(JSON.parse(e.topic)).find(e => e == "auth_id") &&  JSON.parse(e.topic)["auth_id"] == message.author.id).send(
                embed
                    .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                    .setDescription(message.content)
            )
            message.react("✅")
        } else {
            message.channel.send(
                embed
                    .setAuthor("Hello and welcome to the support !")
                    .setDescription("For continue please react to an emoji")
                    .addFields(
                        { name: "🇫🇷", value: "Si vous êtes français" },
                        { name: "🇬🇧", value: "You are english" },
                        { name: "🇪🇸", value: "Eres español" }
                    )

            ).then(msg => {
                let membed = new MessageEmbed()
                msg.react("🇫🇷")
                msg.react("🇬🇧")
                msg.react("🇪🇸")
                const filter = (reaction, user) => { return !user.bot && (reaction.emoji.name == "🇫🇷" || reaction.emoji.name == "🇬🇧" || reaction.emoji.name == "🇪🇸") }
                msg.awaitReactions(filter, {
                    max: 1,
                    time: 15000,
                    erros: ["time"]
                }).then(collected => {
                    reaction = collected.first()
                    if (guild_support.channels.cache.find(e => e.name == `ticket_${message.author.id}`)) return;
                    if (!reaction) return;
                    switch (reaction.emoji.name) {
                        case "🇪🇸":
                            guild_support.channels.create(`ticket_${message.author.username}`, {
                                type: "text",
                                parent: db.ticket_esp,
                                topic: `{"date": ${Date.now()}, "auth_id": "${message.author.id}"}`
                            }).then(ch => {
                                (message.attachments.size > 0) ? membed.setImage(message.attachments.first().attachment) : null
                                ch.send("<@&792408201819717663>")
                                ch.send(
                                    membed
                                        .setAuthor("Nuevo ticket")
                                        .setDescription("El ticket fue creado por " + message.author.tag + ` (${message.author.id})`)
                                        .addFields(
                                            { name: "Descripción del problema", value: message.content },
                                            { name: "Fecha de creación del ticket", value: moment(Date.now()).format("HH:mm DD/MM/YYYY") }
                                        )
                                )
                            })
                            message.channel.send("Tu ticket ha sido creado")
                            break
                        case "🇬🇧":
                            guild_support.channels.create(`ticket_${message.author.username}`, {
                                type: "text",
                                parent: db.ticket_engl,
                                topic: `{"date": ${Date.now()}, "auth_id": "${message.author.id}"}`
                            }).then(ch => {
                                (message.attachments.size > 0) ? membed.setImage(message.attachments.first().attachment) : null
                                ch.send("<@&792408201819717663>")
                                ch.send(
                                    membed
                                        .setAuthor("New ticket")
                                        .setDescription("Author of the ticket: " + message.author.tag + ` (${message.author.id})`)
                                        .addFields(
                                            { name: "Description of the problem", value: message.content },
                                            { name: "Ticket created at", value: moment(Date.now()).format("HH:mm DD/MM/YYYY") }
                                        )
                                )
                            })
                            message.channel.send("Your ticket has been created")
                            break
                        case "🇫🇷":
                            guild_support.channels.create(`ticket_${message.author.username}`, {
                                type: "text",
                                parent: db.ticket_fr,
                                topic: `{"date": ${Date.now()}, "auth_id": "${message.author.id}"}`
                            }).then(ch => {
                                (message.attachments.size > 0) ? membed.setImage(message.attachments.first().attachment) : null
                                ch.send("<@&792408201819717663>")
                                ch.send(
                                    membed
                                        .setAuthor("Nouveau ticket")
                                        .setDescription("Auteur du ticket: " + message.author.tag + ` (${message.author.id})`)
                                        .addFields(
                                            { name: "Description du problème", value: message.content },
                                            { name: "Ticket créer le", value: moment(Date.now()).format("HH:mm DD/MM/YYYY") }
                                        )
                                )
                            })
                            message.channel.send("Ton ticket a été créer")
                            break
                    }
                })
            })
        }
    } else {
        if (message.guild.id == db.support_id) {
            if (!message.channel.topic) return
            if (!message.channel.parent.name.toLowerCase().startsWith("ticket")) return
            let info = JSON.parse(message.channel.topic)
            if (!client.users.cache.has(info.auth_id)) return message.channel.send("Error: user not found")
            switch (message.channel.parent.id) {
                case db.ticket_engl:
                    client.users.cache.get(info.auth_id).send({
                        embed: new MessageEmbed()
                            .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                            .setTitle("Nueva respuesta de soporte")
                            .setDescription(message.content)
                    })
                    break
                case db.ticket_fr:
                    client.users.cache.get(info.auth_id).send({
                        embed: new MessageEmbed()
                            .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                            .setTitle("Nouvelle réponse du support")
                            .setDescription(message.content)
                    })
                    break
                case db.ticket_esp:
                    client.users.cache.get(info.auth_id).send({
                        embed: new MessageEmbed()
                            .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                            .setTitle("New response from the support")
                            .setDescription(message.content)
                    })
                    break
            }
        }
    }

}
