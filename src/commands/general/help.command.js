const fs = require("fs");
const _ = require('lodash');

const { MessageEmbed } = require('discord.js');

module.exports.run = async (message, args, client, guildModel) => {
    const { commands } = message.client;
    
    if (!args.length) {
        const helpEmbed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL())
            .setDescription(`Type \`${guildModel.prefix}help [command]\` for more help eg. \`${guildModel.prefix}help mute\``);

        const commandFolders = fs.readdirSync('./src/commands');

        for (const folder of commandFolders) {
            const field = {
                name: _.capitalize(folder)
            };

            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));

            let fieldContend = ``;

            for (const file of commandFiles) {
                const command = require(`../${folder}/${file}`);
                fieldContend += `\`${command.config.command}\` `;
            }

            field.value = fieldContend;

            helpEmbed.addFields(field);
        }

        return await message.channel.send(helpEmbed);
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.config.aliases && c.config.aliases.includes(name));

    if (!command) {
        return message.reply('that\'s not a valid command!');
    }

    const helpEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setAuthor(client.user.username, client.user.displayAvatarURL())
            .setTitle(`Help for ${command.config.command} command`)
            .addFields(
                {
                    name: "Description",
                    value: command.config.description || "This command has no description"
                }
            );

    if (command.config.aliases) helpEmbed.addField(`**Aliases:**`, `${command.config.aliases.join(', ')}`);
    if (command.config.usage) helpEmbed.addField(`**Usage:**`, `${guildModel.prefix}${command.config.usage}`);
    if (command.config.requireArgs) helpEmbed.addField(`**Required Args:**`, `${command.config.requireArgs}`);
    if (command.config.example) helpEmbed.addField(`**Example:**`, `${guildModel.prefix}${command.config.example}`);
    
    helpEmbed.addField(`**Cooldown:**`, `${command.config.cooldown || 5} second(s)`);

    await message.channel.send(helpEmbed);
}

module.exports.config = {
    name: "Help",
    command: "help",
    description: "Display bot help",
    aliases: ["h"],
    requireArgs: 0,
    usage: "help [command]"
}