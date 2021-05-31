const { MemberHelper, GuildHelper } = require('../../helpers');
const { MessageEmbed } = require('discord.js');

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
        await MemberHelper.mute(message, member, durationString, reason, message.author.tag);

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