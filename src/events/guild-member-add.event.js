const redis = require('../config/redis');
const { Guild } = require('../models');
const { GuildHelper, MemberHelper } = require('../helpers');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'guildMemberAdd',
	async execute(member) {
        const { id, guild } = member;

        const guildModel = await Guild.findOne({
            id: guild.id
        });
        
        redis.client.get(`muted-${id}`, async (err, result) => {
            if (err) {
                console.log("Redis error", err);
            } else if (result) {
                const role = await guild.roles.cache.find(role => role.id === guildModel.mutedRoleId);

                if (role) {
                    await member.roles.add(role);
                }
            }
        });

        const embed = new MessageEmbed()
            .setColor('GREEN')
            .setAuthor(`Member Joined`, member.user.displayAvatarURL())
            .setDescription(`${member.user} ${member.user.tag}`)
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter(`ID: ${member.user.id}`)
            .setTimestamp();

        await GuildHelper.log(guild, embed);
        await MemberHelper.welcome(guild, member);
	}
};