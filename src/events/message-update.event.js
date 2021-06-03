const { GuildHelper } = require('../helpers');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'messageUpdate',
	async execute(oldMessage, newMessage) {
        if (oldMessage.author.bot) return;

        const embed = new MessageEmbed()
            .setAuthor(oldMessage.author.username, oldMessage.author.displayAvatarURL())
            .setColor("BLUE")
            .setDescription(`:pencil2: **Message sent by ${oldMessage.author} in ${oldMessage.channel} has been updated [Jump to message](${oldMessage.url})**\n\n**Old**\n\`\`\`${oldMessage.content}\`\`\`\n\n**New**\n\`\`\`${newMessage.content}\`\`\``);

        await GuildHelper.log(newMessage.guild, embed);
	}
};