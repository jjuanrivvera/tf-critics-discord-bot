const { GuildHelper } = require('../helpers');
const { Guild } = require('../models');

module.exports = {
    name: 'message',
    async execute(message, client) {
        if (message.author.bot || !message.guild) return;

        const guildModel = await Guild.findOne({
			id: message.guild.id
		});

		if (!guildModel || !guildModel.features.includes('level-system')) return;

        await GuildHelper.checkExperience(message, client, guildModel);
    }
};