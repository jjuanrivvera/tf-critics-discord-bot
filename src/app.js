const fs = require("fs");

const { DISCORD_TOKEN } = require('./config');
const { Client, Collection } = require("discord.js");
const client = new Client();

const { Case, Guild } = require("./models");

module.exports = {
    loadCommands() {
        client.commands = new Collection();
        client.cooldowns = new Collection();
        client.messageCooldowns = new Collection();

        const commandFolders = fs.readdirSync('./src/commands');

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`./commands/${folder}/${file}`);
                client.commands.set(command.config.command, command);
                console.log(`${command.config.name} Command loaded`);
            }
        }
    },

    loadEvents() {
        const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(`./events/${file}`);

            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    },

    async loadRedisListeners(redis) {
        redis.expire("all", async (msg) => {
            const values = msg.split("-");

            const guildId = values[1];
            const memberId = values[2];
            const caseNumber = values[3];

            const guildModel = await Guild.findOne({
                id: guildId
            });

            const caseItem = await Case.findOne({
                guildId: guildId,
                number: caseNumber,
            });

            const guild = client.guilds.cache.find(guild => guild.id === guildId);
            const member = guild.members.cache.find(member => member.id === memberId);
            const role = guild.roles.cache.find(role => role.id === guildModel.mutedRoleId);

            await member.roles.remove(role);

            caseItem.status = "inactive";
            await caseItem.save();

            client.emit('unmute', member, "Auto unmute", caseItem, client.user.tag);
        });
    },
    
    login() {
        client.login(DISCORD_TOKEN);
    }
}