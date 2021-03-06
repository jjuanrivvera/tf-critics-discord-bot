const { GuildHelper } = require('../helpers');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'messageDelete',
	async execute(message) {
        if (message.author.bot) return;

        const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setColor("RED")
            .setDescription(`:x: **Message sent by ${message.author} in ${message.channel} has been deleted**\n\n**Content**\n\`\`\`${message.content}\`\`\``);

        await GuildHelper.log(message.guild, embed);
	}
};