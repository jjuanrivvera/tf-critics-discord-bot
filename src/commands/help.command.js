const { MessageEmbed } = require('discord.js');
const Command = require('../models/command.model');

module.exports.run = async (message, args) => {
    try {
        if (!args.length) {
            await Command.find({}, async function(err, commands) {
                let commandMap = [];
                let help = new MessageEmbed().setColor("0x1D82B6");
                help.setTitle("Available Command List");

                commands.forEach(function(command) {
                    if (command.group === "User") {
                        help.addField(`${command.name}`, `**Description:** ${command.description}\n**Usage:** ${command.usage}`);
                    }
                    commandMap.push(command);
                });

                message.channel.send(help);
            });
        }
    } catch (err) {
        console.log(err);
        message.channel.send("Error displaying help menu").then(msg => msg.delete({ timeout: 3000 }));
    }
}

module.exports.config = {
    name: "Avatar",
    command: "help"
}