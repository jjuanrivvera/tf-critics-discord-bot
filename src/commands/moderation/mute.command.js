const { MemberHelper, GuildHelper } = require('../../helpers/index');
const redis = require('../../config/redis');
const { expire } = require('../../config/redis');
const { Guild } = require('../../models');
const { MessageEmbed } = require('discord.js');

module.exports.run = async (message, args, client) => {
    const guildModel = await Guild.findOne({
        id: message.guild.id
    });

    let role = message.guild.roles.cache.find(role => role.id === guildModel.mutedRoleId);

    if (!role) {
        role = await GuildHelper.createMutedRole(message.guild);
    }

    if (!args.length) {
        return message.channel.send("You must provide a username").then(msg => msg.delete({ timeout: 3000 }));
    }

    let member = message.mentions.members.first();

    const durationString = args[1];
    const reason = args.slice(2).join(' ');

    if (!member) {
        member = await message.guild.members.cache.find(member => member.user.tag === args[0]);

        if (!member) {
            return message.channel.send(`Provide a valid user"`).then(msg => msg.delete({ timeout: 3000 }));
        }
    }

    if (!durationString || !reason) {
        return message.channel.send(`Use the correct syntax "${this.config.usage}"`).then(msg => msg.delete({ timeout: 3000 }));
    }

    if (await MemberHelper.memberHasModRole(message.member) || message.member.hasPermission('ADMINISTRATOR')) {

        if (await MemberHelper.isMuted(member)) {
            await message.channel.send("User already muted").then(msg => msg.delete({ timeout: 3000 }));
        } else {
            const durations = {
                m: 60,
                h: 60 * 60,
                d: 60 * 60 * 24,
                life: -1
            };

            const durationType = durationString.match(/[a-zA-Z]+/g);
            const duration = durationString.match(/\d+/g);
            const seconds = duration * durations[durationType];

            const redisClient = await redis();

            const redisKey = `muted-${message.guild.id}-${member.user.id}`;

            try {
                if (seconds > 0) {
                    redisClient.set(redisKey, true, "EX", seconds);

                    await expire(redisKey, async (message) => {
                        const args = message.split("-");
        
                        const guildId = args[1];
                        const memberId = args[2];
        
                        const guild = client.guilds.cache.find(guild => guild.id === guildId);
                        const member = guild.members.cache.find(member => member.id === memberId);
        
                        member.roles.remove(role);
        
                        console.log(`${member.user.tag} unmuted`);
                    });
                } else {
                    redisClient.set(redisKey, true);
                }
            } finally {
                redisClient.quit();
            }

            await member.roles.add(role);

            const mutedEmbed = new MessageEmbed().setColor("#95A5A6");
            mutedEmbed.setTitle(`The user ${member.user.tag} was muted ${durationString} for "${reason}" by ${message.author.tag}`);

            await message.channel.send(mutedEmbed);
        }
    } else {
        await message.channel.send("You are ot authorized to perform this action").then(msg => msg.delete({ timeout: 3000 }));
    }
}

module.exports.config = {
    name: "Mute",
    command: "mute",
    usage: "mute <user> <duration> <reason>",
    example: "mute Alex#1234 2h Breaking the rules",
    args: true
}