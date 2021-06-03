const { GuildHelper } = require('../helpers');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'messageDeleteBulk',
	async execute(messages) {
        const message = messages.first();
        
        const embed = new MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setColor("RED")
            .setDescription(`**Bulk Delete in ${message.channel}, ${messages.size - 1} deleted**`);

        await GuildHelper.log(message.guild, embed);
	}
};