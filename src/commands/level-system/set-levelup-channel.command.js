module.exports.run = async (message, args, client, guildModel) => {
    const commandLength = `${guildModel.prefix}slc`.length;
    const content = message.content.slice(commandLength).trim();

    if (args[0] == "off") {
        guildModel.levelUpdatesChannel = null;
        await guildModel.save();

        return message.channel.send("LevelUp channel successfully removed").then(msg => msg.delete({ timeout: 4000 }));
    }

    if (content.startsWith('<#') && content.endsWith('>')) {
        const channel = message.content.replace(/\D/g,'');

        guildModel.levelUpdatesChannel = channel;
        await guildModel.save();

        message.channel.send("LevelUp channel successfully set").then(msg => msg.delete({ timeout: 4000 }));
    } else {
        message.channel.send("Provide a valid channel").then(msg => msg.delete({ timeout: 3000 }));
    }
}

module.exports.config = {
    name: "Set LevelUp Channel",
    description: "Set Level Up Channel",
    command: "set-levelup-channel",
    aliases: ['slc'],
    example: "set-levelup-channel #level-up",
    usage: "set-levelup-channel <channel>",
    requireArgs: 1,
    args: true
}