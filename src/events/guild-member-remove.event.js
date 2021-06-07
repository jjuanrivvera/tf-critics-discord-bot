const redis = require('../config/redis');
const { MessageEmbed } = require('discord.js');
const { GuildHelper, MemberHelper } = require('../helpers');

module.exports = {
	name: 'guildMemberRemove',
	async execute(member) {
        const { guild } = member;

        const embed = new MessageEmbed()
            .setColor('RED')
            .setDescription(`**Member Left**\n\n${member.user} ${member.user.tag}`)
            .setTimestamp();

        await GuildHelper.log(guild, embed);
        await MemberHelper.leave(guild, member);
	}
};