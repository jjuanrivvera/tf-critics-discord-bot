const { MessageEmbed } = require('discord.js');
const Command = require('../models/command.model');

const getCommandsEmbed = async (group = "User") => {
    const commands = await Command.find({ group: group});

    let commandEmbed = [];
    let help = new MessageEmbed().setColor("0x1D82B6");
    help.setTitle("Available Command List");

    commands.forEach(function(command) {
        help.addField(`${command.name}`, `**Description:** ${command.description}\n**Usage:** ${command.usage}`);
        commandEmbed.push(command);
    });

    return help;
};

module.exports.run = async (message, args) => {
    if (args.length <= 0) {
        return await message.channel.send(await getCommandsEmbed());
    } else {
        const group = args[0];

        if (!group) {
            return await message.channel.send(await getCommandsEmbed());
        }

        await message.channel.send(await getCommandsEmbed(group));
    }
}

module.exports.config = {
    name: "Avatar",
    command: "help"
}