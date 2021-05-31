const { Profile } = require('../models');
const { MemberHelper } = require('../helpers');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'warn',
	async execute(message, member) {
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

        if (profile.warningCount === 4) {
            await MemberHelper.mute(message, member, '4h', 'Automute', message.client.user.tag);
            profile.warningCount = 0;

            const mutedEmbed = new MessageEmbed().setColor("#95A5A6")
                .setDescription(`The user ${member} was muted for "Automute" by ${message.client.user}`);

            await message.channel.send(mutedEmbed);
        }

        await profile.save();
	}
};