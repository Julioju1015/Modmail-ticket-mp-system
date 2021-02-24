const { Client, Collection } = require("discord.js")
const { readdirSync, readFileSync } = require("fs")
const chalk = require("chalk")
const moment = require("moment")

const client = new Client()
client.commands = new Collection()
client.categories = readdirSync("./Command")
 

const db = JSON.parse(readFileSync("config.json"))
for (const cat of client.categories) {
    readdirSync("./Command/" + cat).forEach(file => {
        try {
            client.commands.set(file.split(".").shift(), require("./Command/" + cat + "/" + file))
            console.log(`${moment(Date.now()).local("fr").format("HH:mm")} | ${chalk.gray("[CMD]")} Command loaded: ${file.split(".").shift()}`)
        } catch (err) {
            console.log(`${moment(Date.now()).local("fr").format("HH:mm")} | ${chalk.bgRedBright("[CMD]")} Command Fail to load: ${file.split(".").shift()}: ${err.message?err.message:err}`)
        }
    })
}

for (const file of readdirSync("./Event")) {
    try {
        client.on(file.split(".").shift(), require("./Event/" + file).bind(null, client));
        console.log(`${moment(Date.now()).local("fr").format("HH:mm")} | ${chalk.blue("[EVENT]")} Event loaded ${file.split(".").shift()}`);
    } catch (error) {
        console.error(`${moment(Date.now()).local("fr").format("HH:mm")} | ${chalk.bgRedBright("[EVENT]")} Event fail to load ${file}: ${error}`);
    }
}

client.login(db.token)