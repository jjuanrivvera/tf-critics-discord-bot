const { GuildHelper } = require('../helpers');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'messageDelete',
	async execute(message) {
        console.log("delete");
        const embed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`:pencil2:  **Message sent by ${message.author} in ${message.channel} has been deleted**\n\n**Content**\n\`\`\`${message.content}\`\`\``);

        await GuildHelper.log(message.guild, embed);
	}
};