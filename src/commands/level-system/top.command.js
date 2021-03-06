const { Profile } = require('../../models');
const { GuildHelper } = require('../../helpers');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "Top",
    description: "Display users ranking",
    command: "top",
    aliases: ['levels'],
    requireArgs: 0,
    usage: "top",
    accessibility: "everyone",
	clientPermissions: [
		"SEND_MESSAGES",
        "EMBED_LINKS"
	],
    async run(message) {
        const profiles = await Profile.find({
            guildId: message.guild.id
        }).sort({ xp: -1}).limit(10);
    
        const topEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
            .setTimestamp();
    
        for (const [index, profile] of profiles.entries()) {
            const member = message.guild.members.cache.find(member => member.user.id === profile.userId);
    
            if (member) {
                topEmbed.addField(
                    `${index + 1}. **${member.user.tag}**`,
                    `**Exp:** \`${profile.xp}\` | **Level:** \`${profile.level}\``
                );
            }
            
        }
    
        return message.channel.send(topEmbed);
    }
}