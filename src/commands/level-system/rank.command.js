const { Profile } = require('../../models');
const { GuildHelper } = require('../../helpers');
const { MessageEmbed } = require('discord.js');

module.exports.run = async (message, args) => {
    let member = message.mentions.members.first();

    if (!member) {
        member = await message.guild.members.cache.find(member => member.user.tag === args[0]);

        if (!member) {
            member = message.member;
        }
    }

    const profile = await Profile.findOne({
        guildId: message.guild.id,
        userId: member.user.id
    });

    const rankEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setAuthor(member.user.username, member.user.displayAvatarURL())
        .setDescription(`Your current level is \`${profile.level}\`\n**Expirience:** ${profile.xp}/${GuildHelper.getNeedExperienceToLevelUp(profile.level + 1)}`)
        .setTimestamp();

    return message.channel.send(rankEmbed);
}

module.exports.config = {
    name: "Rank",
    description: "Get user rank",
    command: "rank",
    requireArgs: 0,
    aliases: ['level', 'ranking'],
    usage: "rank [user]"
}