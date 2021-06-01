const { Profile } = require('../../models');
const { GuildHelper } = require('../../helpers');
const { MessageEmbed } = require('discord.js');

module.exports.run = async (message) => {
    const profiles = await Profile.find({}).sort({ xp: -1}).limit(10);

    const topEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
        .setTimestamp();

    for (const [index, profile] of profiles.entries()) {
        const member = message.guild.members.cache.find(member => member.user.id === profile.userId);

        if (member) {
            topEmbed.addField(
                `${index + 1}. **${member.user.tag}**`,
                `**Exp:** ${profile.xp} / ${GuildHelper.getNeedExperienceToLevelUp(profile.level + 1)} | **Level:** \`${profile.level}\``
            );
        }
        
    }

    return message.channel.send(topEmbed);
}

module.exports.config = {
    name: "Top",
    description: "Display users ranking",
    command: "top",
    aliases: ['levels'],
    requireArgs: 0,
    usage: "top"
}