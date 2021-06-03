const { MessageEmbed } = require('discord.js');

module.exports.run = async (message, args, client, guildModel) => {
    guildModel.prefix = args[0];
	await guildModel.save();
	
	const embed = new MessageEmbed()
		.setAuthor(client.user.username, client.user.displayAvatarURL())
		.setDescription(`Prefix changed`);

	await message.channel.send(embed);
}

module.exports.config = {
    name: "Prefix",
    description: "Change bot prefix",
    command: "prefix",
	aliases: ['p'],
    requireArgs: 1,
    usage: "prefix <prefix>",
	example: "prefix !",
	adminCommand: true
}