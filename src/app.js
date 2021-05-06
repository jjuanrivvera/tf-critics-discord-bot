const fs = require("fs");

const Discord = require("discord.js");
const discordClient = new Discord.Client();
const discordToken = process.env.DISCORD_TOKEN;

module.exports = {
    loadCommands() {
        //Discord commands collection
        discordClient.commands = new Discord.Collection();

        const files = fs.readdirSync('./src/commands/').filter(file => file.endsWith('.js'));

        for (const file of files) {
            const command = require(`./commands/${file}`);
            // set a new item in the Collection
            // with the key as the command name and the value as the exported module
            discordClient.commands.set(command.config.command, command);
            console.log(`Command ${command.config.name} loaded`);
        }
    },
    loadEvents() {
        const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(`./events/${file}`);

            if (event.once) {
                discordClient.once(event.name, (...args) => event.execute(...args, discordClient));
            } else {
                discordClient.on(event.name, (...args) => event.execute(...args, discordClient));
            }
        }
    },
    login() {
        discordClient.login(discordToken);
    }
}