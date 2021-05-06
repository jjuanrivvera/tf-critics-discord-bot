const { MessageEmbed } = require('discord.js');
const Command = require('../../models/command.model');

module.exports.run = async (message, args) => {
    const group = args.length ? args[0] : "User";
    const commands = await Command.find({ group: group});

    if (!commands.length) {
        return await message.channel.send("Wrong command or group").then(msg => msg.delete({ timeout: 3000 }))
    }

    const commandEmbed = new MessageEmbed().setColor("0x1D82B6");
    commandEmbed.setTitle("Available Command List");

    commands.forEach(function(command) {
        commandEmbed.addField(`${command.name}`, `**Description:** ${command.description}\n**Usage:** ${command.usage}`);
    });

    return await message.channel.send(commandEmbed);
}

module.exports.config = {
    name: "Help",
    command: "help"
}