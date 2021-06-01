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
        const cases = await Case.find({
            type: 'mute'
        });

        for (const caseItem of cases) {
            const redisKey = `muted-${caseItem.guildId}-${caseItem.memberId}`;

            await redis.expire(redisKey, async () => {
                const guildId = caseItem.guildId;
                const memberId = caseItem.memberId;

                const guildModel = await Guild.findOne({
                    id: guildId
                });

                const guild = client.guilds.cache.find(guild => guild.id === guildId);
                const member = guild.members.cache.find(member => member.id === memberId);
                const role = guild.roles.cache.find(role => role.id === guildModel.mutedRoleId);

                await member.roles.remove(role);

                await caseItem.delete();

                console.log(`${member.user.tag} unmuted`);
            });
        }
    },
    
    login() {
        client.login(DISCORD_TOKEN);
    }
}