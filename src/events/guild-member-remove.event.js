const redis = require('../config/redis');
const { MessageEmbed } = require('discord.js');
const { GuildHelper, MemberHelper } = require('../helpers');

module.exports = {
	name: 'guildMemberRemove',
	async execute(member) {
        const { guild } = member;

        const embed = new MessageEmbed()
            .setColor('RED')
            .setAuthor(`Member Left`, member.user.displayAvatarURL())
            .setDescription(`${member.user} ${member.user.tag}`)
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter(`ID: ${member.user.id}`)
            .setTimestamp();

        await GuildHelper.log(guild, embed);
        await MemberHelper.leave(guild, member);
	}
};