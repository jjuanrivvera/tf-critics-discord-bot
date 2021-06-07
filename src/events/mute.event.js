const { MessageEmbed } = require('discord.js');
const { GuildHelper } = require('../helpers');

module.exports = {
	name: 'mute',
	async execute(member, reason, duration, caseItem) {
		const embed = new MessageEmbed()
			.setColor("#E74C3C")
			.setAuthor(`Case ${caseItem.number} | Mute | ${member.user.tag}`, member.user.displayAvatarURL())
			.addFields(
				{
					name: "User",
					value: member.user,
					inline: true
				},
				{
					name: "Moderator",
					value: caseItem.responsable,
					inline: true
				},
				{
					name: "Duration",
					value: duration,
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