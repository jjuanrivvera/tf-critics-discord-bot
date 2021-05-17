const { MemberHelper } = require('../../helpers/index');
const { MessageEmbed } = require('discord.js');
const { Case } = require("../../models/index");

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

    const reason = args.slice(1).join(' ');

    if (!reason) {
        return message.channel.send("You must provide a reason").then(msg => msg.delete({ timeout: 3000 }));
    }

    if (await MemberHelper.memberHasModRole(message.member) || message.member.hasPermission('ADMINISTRATOR')) {
    
        if (await MemberHelper.memberIsProtected(member) || member.kickable === false) {
            await message.channel.send("I can't warn this user").then(msg => msg.delete({ timeout: 3000 }));
        } else {
            await Case.create({
                guildId: message.guild.id,
                target: member.user.tag,
                type: "warn",
                reason: reason,
                responsable: message.author.tag,
                date: new Date()
            });

            const warnEmbed = new MessageEmbed().setColor("#E74C3C");
            warnEmbed.setTitle(`The user ${member.user.tag} was warned for "${reason}" by ${message.author.tag}`);

            await message.channel.send(warnEmbed);
        }
    } else {
        await message.channel.send("You are ot authorized to perform this action").then(msg => msg.delete({ timeout: 3000 }));
    }
}

module.exports.config = {
    name: "Warn",
    command: "warn",
    usage: "warn <user> <reason>",
    args: true
}