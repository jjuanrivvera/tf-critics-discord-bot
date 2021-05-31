const { MemberHelper } = require('../../helpers');
const { MessageEmbed } = require('discord.js');

module.exports.run = async (message, args) => {
    if (!args.length) {
        return message.channel.send("You must provide a username").then(msg => msg.delete({ timeout: 3000 }));
    }

    let member = message.mentions.members.first();

    if (!member) {
        member = await message.guild.members.cache.find(member => member.user.tag === args[0]);

        if (!member) {
            return message.channel.send("Provide a valid username").then(msg => msg.delete({ timeout: 3000 }));
        }
    }

    await MemberHelper.clearWarnings(message.guild, member);

    const warnEmbed = new MessageEmbed().setColor("#95A5A6")
            .setDescription(`All ${member.user.tag}'s warnings cleared`);

    await message.channel.send(warnEmbed);
}

module.exports.config = {
    name: "Clear Warnings",
    command: "clearwarns",
    description: "Deletes all user's warnings",
    usage: "clearwarns <user>",
    example: "clearwarns @Alex",
    aliases: ["forgive"],
    cooldown: 5,
    requireArgs: 1,
    modCommand: true,
    args: true
}