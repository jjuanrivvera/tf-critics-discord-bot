module.exports = {
    name: "Clear",
    command: "clear",
    description: "Clear messages",
    usage: "clear <number of messages>",
    example: "clear 7",
    aliases: ['cl', 'purge', 'delete'],
    requireArgs: 1,
    accessibility: "mod",
	clientPermissions: [
		"SEND_MESSAGES",
        "EMBED_LINKS",
        "MANAGE_MESSAGES"
	],
    async run (message, args) {
        const number = parseInt(args[0]);

        if (isNaN(number) || number < 1) {
            return message.channel.send("You must provide a valid number").then(msg => msg.delete({ timeout: 3000 }));
        }
    
        await message.channel.bulkDelete(number + 1);
    }
}