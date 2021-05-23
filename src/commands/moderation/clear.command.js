module.exports.run = async (message, args) => {
    if (!Number.isInteger(parseInt(args[0])) || args[0] < 1) {
        return await message.channel.send("You must provide a valid number").then(msg => msg.delete({ timeout: 3000 }));
    }

    await message.channel.bulkDelete(parseInt(args[0]) + 1);
    message.channel.send(`${args[0]} messages cleared`).then(msg => msg.delete({ timeout: 3000 }));
}

module.exports.config = {
    name: "Clear",
    command: "clear",
    description: "Clear messages",
    usage: "clear <number of messages>",
    example: "clear 7",
    aliases: ['cl', 'purge', 'delete'],
    requireArgs: 1,
    modCommand: true,
    args: true
}