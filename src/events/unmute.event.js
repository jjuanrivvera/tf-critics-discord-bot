const { MessageEmbed } = require('discord.js');
const { GuildHelper } = require('../helpers');

module.exports = {
	name: 'unmute',
	async execute(member, reason, caseItem, responsable) {
		const embed = new MessageEmbed()
			.setColor("GREEN")
			.setAuthor(`Case ${caseItem.number} | Unmute | ${member.user.tag}`, member.user.displayAvatarURL())
			.addFields(
				{
					name: "User",
					value: member.user,
					inline: true
				},
				{
					name: "Moderator",
					value: responsable,
					inline: true
				},
				{
					name: "Reason",
					value: reason,
					inline: true
				}
			);
		
		await GuildHelper.log(member.guild, embed);
	}
};