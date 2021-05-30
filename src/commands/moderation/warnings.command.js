const { MessageEmbed } = require('discord.js');
const { Case } = require("../../models");
const moment = require('moment');

module.exports.run = async (message, args) => {
    let member = message.mentions.members.first();

    if (!member) {
        member = await message.guild.members.cache.find(member => member.user.tag === args[0]);

        if (!member) {
            return message.channel.send("Provide a valid username").then(msg => msg.delete({ timeout: 3000 }));
        }
    }

    const cases = await Case.find({
        target: member.user.tag,
        type: 'warn'
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

module.exports.config = {
    name: "Warnings",
    command: "warnings",
    description: "List user's warnings",
    usage: "warnings <user>",
    example: "warnings @Alex",
    requireArgs: 1,
    modCommand: true,
    args: true
}