module.exports = {
    name: "Set LevelUp Channel",
    description: "Set Level Up Channel",
    command: "set-levelup-channel",
    aliases: ['slc'],
    example: "set-levelup-channel #level-up",
    usage: "set-levelup-channel <channel>",
    requireArgs: 1,
    accessibility: "admin",
	clientPermissions: [
		"SEND_MESSAGES",
        "EMBED_LINKS"
	],
    async run(message, args, _, guildModel) {
        const commandLength = `${guildModel.prefix}slc`.length;
        const content = message.content.slice(commandLength).trim();

        if (args[0] == "off") {
            guildModel.alerts.levelup = null;
            await guildModel.save();

            return message.channel.send("LevelUp channel successfully removed").then(msg => msg.delete({ timeout: 4000 }));
        }

        if (content.startsWith('<#') && content.endsWith('>')) {
            const channel = message.content.replace(/\D/g,'');

            guildModel.alerts.levelup = channel;
            await guildModel.save();

            return message.channel.send("LevelUp channel successfully set").then(msg => msg.delete({ timeout: 4000 }));
        } else {
            return message.channel.send("Provide a valid channel").then(msg => msg.delete({ timeout: 3000 }));
        }
    }
}