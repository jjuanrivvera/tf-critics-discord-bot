const { MessageEmbed } = require('discord.js');

module.exports = {
	name: "Prefix",
    description: "Change bot prefix",
    command: "prefix",
	aliases: ['p'],
    requireArgs: 0,
    usage: "prefix <prefix>",
	example: "prefix !",
	accessibility: "admin",
	clientPermissions: [
		"SEND_MESSAGES",
		"EMBED_LINKS"
	],
	async run (message, args, client, guildModel) {
		const { user } = client;

		if (!args.length) {
			const embed = new MessageEmbed()
				.setAuthor(user.username, user.displayAvatarURL())
				.setDescription(`Current prefix: \`${guildModel.prefix}\``);
	
			return message.channel.send(embed);
		}
	
		guildModel.prefix = args[0];
		await guildModel.save();
		
		const embed = new MessageEmbed()
			.setAuthor(user.username, user.displayAvatarURL())
			.setDescription(`Prefix changed`);
	
		return message.channel.send(embed);
	}
}