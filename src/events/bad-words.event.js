const { MemberHelper } = require('../helpers');
const { MessageEmbed } = require('discord.js');
const { Guild } = require('../models');

module.exports = {
    name: 'message',
    async execute(message) {
        if (message.author.bot) return;

        const guildModel = await Guild.findOne({
			id: message.guild.id
		});

		if (!guildModel) return;

        guildModel.bannedWords

        for (const bannedWord of guildModel.bannedWords) {
            if (message.content.toLowerCase().includes(bannedWord.toLowerCase())) {
                await MemberHelper.warn(message, message.member, "Automod banned words detection", message.client.user.tag);

                const warnEmbed = new MessageEmbed().setColor("#E74C3C")
                    .setDescription(`The user ${message.author} was warned for "Automod banned words detection" by ${message.client.user}`);

                await message.channel.bulkDelete(1);
                await message.channel.send(warnEmbed);
            }
        }
    }
};