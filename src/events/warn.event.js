const { Profile } = require('../models');
const { MemberHelper, GuildHelper } = require('../helpers');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'warn',
	async execute(message, member, reason, caseItem) {
        let profile = await Profile.findOne({
            guildId: message.guild.id,
            userId: member.user.id
        });

        if (!profile) {
            profile = await Profile.create({
                guildId: message.guild.id,
                userId: member.user.id,
            });
        }

        profile.warningCount++;

        if (profile.warningCount > 3) {
            await MemberHelper.mute(message, member, '4h', 'Automute', message.client.user.tag);
            profile.warningCount = 0;

            const mutedEmbed = new MessageEmbed().setColor("#95A5A6")
                .setDescription(`The user ${member} was muted for "Automute" by ${message.client.user}`);

            await message.channel.send(mutedEmbed);
        }

        await profile.save();

        const warnEmbed = new MessageEmbed()
            .setColor("#E74C3C")
            .setAuthor(`Case ${caseItem.number} | Warn | ${member.user.tag}`, member.user.displayAvatarURL())
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
                    name: "Reason",
                    value: reason,
                    inline: true
                }
            );

        await GuildHelper.log(message.guild, warnEmbed);
	}
};