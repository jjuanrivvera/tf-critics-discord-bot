const { MemberHelper } = require('../../helpers/index');
const { MessageEmbed } = require('discord.js');
const { Case } = require("../../models/index");
const moment = require('moment');

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

    if (await MemberHelper.memberHasModRole(message.member, message.guild) || message.member.hasPermission('ADMINISTRATOR')) {
        const cases = await Case.find({
            target: member.user.tag
        });

        const warningsEmbed = new MessageEmbed()
            .setColor("#E67E22")
            .setTitle(`Warning logs`)
            .addFields(
                { name: 'User', value: `${member.user.tag}`, inline: true},
                { name: 'Total', value:  cases.length, inline: true},
            );

        for (const caseElement of cases) {
            warningsEmbed.addField(
                `Case number: ${caseElement.number} | Moderator: ${caseElement.responsable}`,
                `**Reason:** ${caseElement.reason} | **Date:** ${moment(caseElement.date).format("MMMM Do YYYY")}`
            );
        }

        await message.channel.send(warningsEmbed);
    }
}

module.exports.config = {
    name: "Warnings",
    command: "warnings"
}