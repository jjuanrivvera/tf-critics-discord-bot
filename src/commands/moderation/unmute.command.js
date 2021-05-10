const { MemberHelper, GuildHelper } = require('../../helpers/index');
const { Guild } = require('../../models');
const { MessageEmbed } = require('discord.js');
const redis = require('../../config/redis');

module.exports.run = async (message, args, client) => {
    const guildModel = await Guild.findOne({
        id: message.guild.id
    });

    const role = message.guild.roles.cache.find(role => role.id === guildModel.mutedRoleId);

    if (!args.length) {
        return message.channel.send("You must provide a username").then(msg => msg.delete({ timeout: 3000 }));
    }

    let member = message.mentions.members.first();

    if (!member) {
        member = await message.guild.members.cache.find(member => member.user.tag === args[0]);

        if (!member) {
            return message.channel.send(`Provide a valid user"`).then(msg => msg.delete({ timeout: 3000 }));
        }
    }

    if (await MemberHelper.memberHasModRole(message.member) || message.member.hasPermission('ADMINISTRATOR')) {
        if (! await MemberHelper.isMuted(member)) {
            await message.channel.send("This user is not muted").then(msg => msg.delete({ timeout: 3000 }));
        } else {
            member.roles.remove(role);

            const redisClient = await redis();

            try {
                redisClient.del(`muted-${message.guild.id}-${member.user.id}`);
            } finally {
                redisClient.quit();
            }

            const unMutedEmbed = new MessageEmbed().setColor("#95A5A6")
                .setTitle(`The user ${member.user.tag} was unmuted by ${message.author.tag}`);

            await message.channel.send(unMutedEmbed);
        }
    } else {
        await message.channel.send("You are ot authorized to perform this action").then(msg => msg.delete({ timeout: 3000 }));
    }
}

module.exports.config = {
    name: "Unmute",
    command: "unmute",
    usage: "mute <user> <duration> <reason>",
    example: "mute Alex#1234 2h Breaking the rules"
}