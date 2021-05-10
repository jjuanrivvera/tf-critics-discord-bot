const { MemberHelper } = require('../../helpers/index');
const { MessageEmbed } = require('discord.js');
const { Case } = require("../../models/index");
const moment = require('moment');

module.exports.run = async (message, args) => {
    if (!args.length) {
        return message.channel.send("You must provide the case number").then(msg => msg.delete({ timeout: 3000 }));
    }

    if (await MemberHelper.memberHasModRole(message.member, message.guild) || message.member.hasPermission('ADMINISTRATOR')) {
        const caseElement = await Case.findOne({
            number: args[0],
            type: "warn",
        });

        if (!caseElement) {
            return message.channel.send("Wrong case number").then(msg => msg.delete({ timeout: 3000 }));
        } else {
            await Case.deleteOne({
                number: args[0],
                type: "warn",
            });
        }

        const delWarnEmbed = new MessageEmbed().setColor("#2ECC71");
        delWarnEmbed.setTitle(`Case number ${args[0]} deleted by ${message.author.tag}`)
            .addField('Details', `Case type: warning\nUser: ${caseElement.target}\nReason: ${caseElement.reason}\nDate: ${moment(caseElement.date).format("MMMM Do YYYY, h:mm:ss a")}`)
            .setFooter(`${moment().format()}`);


        await message.channel.send(delWarnEmbed);
    } else {
        await message.channel.send("You are ot authorized to perform this action").then(msg => msg.delete({ timeout: 3000 }));
    }
}

module.exports.config = {
    name: "Delete Warning",
    command: "delwarn",
    usage: "delwarn <case-number>"
}