const { MemberHelper, GuildHelper } = require('../../helpers');
const redis = require('../../config/redis');
const { MessageEmbed } = require('discord.js');
const { Case } = require("../../models");

module.exports.run = async (message, args, client, guildModel) => {
    let role = message.guild.roles.cache.find(role => role.id === guildModel.mutedRoleId);

    if (!role) {
        role = await GuildHelper.createMutedRole(message.guild);
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

        const redisKey = `muted-${message.guild.id}-${member.user.id}`;

        if (seconds > 0) {
            redis.client.set(redisKey, true, "EX", seconds);

            await redis.expire(redisKey, async (message) => {
                const args = message.split("-");

                const guildId = args[1];
                const memberId = args[2];

                const guild = client.guilds.cache.find(guild => guild.id === guildId);
                const member = guild.members.cache.find(member => member.id === memberId);

                await Case.deleteOne({
                    type: 'mute',
                    memberId: member.id
                });

                member.roles.remove(role);

                console.log(`${member.user.tag} unmuted`);
            });
        } else {
            redis.client.set(redisKey, true);
        }

        await member.roles.add(role);

        await Case.create({
            guildId: message.guild.id,
            memberId: member.id,
            target: member.user.tag,
            type: "mute",
            reason: reason,
            responsable: message.author.tag,
            date: new Date()
        });

        const mutedEmbed = new MessageEmbed().setColor("#95A5A6")
            .setDescription(`The user ${member.user.tag} was muted ${durationString} for "${reason}" by ${message.author.tag}`);

        await message.channel.send(mutedEmbed);
    }
}

module.exports.config = {
    name: "Mute",
    description: "Mute a user",
    command: "mute",
    usage: "mute <user> <duration> <reason>",
    example: "mute Alex#1234 2h Breaking the rules",
    aliases: ['mt'],
    requireArgs: 3,
    modCommand: true,
    args: true
}