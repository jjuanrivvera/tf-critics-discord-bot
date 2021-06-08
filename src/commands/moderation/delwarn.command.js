const { MessageEmbed } = require('discord.js');
const { Case } = require("../../models/index");
const moment = require('moment');

module.exports.run = async (message, args) => {    
    const caseElement = await Case.findOne({
        number: args[0],
        type: "warn",
    });

    if (!caseElement) {
        return message.channel.send("Wrong case number").then(msg => msg.delete({ timeout: 3000 }));
    } else {
        await Case.findOneAndUpdate({
            number: args[0],
            type: "warn",
        }, {
            status: "inactive"
        });
    }

    const delWarnEmbed = new MessageEmbed().setColor("#2ECC71")
        .setTitle(`Case number ${args[0]} deleted by ${message.author.tag}`)
        .addField('Details', `Case type: warning\nUser: ${caseElement.target}\nReason: ${caseElement.reason}\nDate: ${moment(caseElement.date).format("MMMM Do YYYY, h:mm:ss a")}`)
        .setFooter(`${moment().format()}`);


    await message.channel.send(delWarnEmbed);
}

module.exports.config = {
    name: "Delete Warning",
    command: "delwarn",
    usage: "delwarn <case-number>",
    requireArgs: 1,
    modCommand: true,
    args: true
}