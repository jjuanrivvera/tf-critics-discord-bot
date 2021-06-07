const redis = require('../config/redis');
const { Guild } = require('../models');
const { GuildHelper } = require('../helpers');
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
            .setDescription(`**Member Joined**\n\n${member.user} ${member.user.tag}`)
            .setTimestamp();

        await GuildHelper.log(guild, embed);
	}
};