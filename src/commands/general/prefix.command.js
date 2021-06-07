const { MessageEmbed } = require('discord.js');

module.exports.run = async (message, args, client, guildModel) => {
	if (!args.length) {
		const embed = new MessageEmbed()
			.setAuthor(client.user.username, client.user.displayAvatarURL())
			.setDescription(`Current prefix: \`${guildModel.prefix}\``);

		return message.channel.send(embed);
	}

    guildModel.prefix = args[0];
	await guildModel.save();
	
	const embed = new MessageEmbed()
		.setAuthor(client.user.username, client.user.displayAvatarURL())
		.setDescription(`Prefix changed`);

	return message.channel.send(embed);
}

module.exports.config = {
    name: "Prefix",
    description: "Change bot prefix",
    command: "prefix",
	aliases: ['p'],
    requireArgs: 0,
    usage: "prefix <prefix>",
	example: "prefix !",
	adminCommand: true
}