module.exports = {
    name: "Ping",
    description: "Get bot response speed",
    command: "ping",
    requireArgs: 0,
    usage: "ping",
    accessibility: "everyone",
	clientPermissions: [
		"SEND_MESSAGES"
	],
    async run(message) {
        message.channel.send(`Pong | 🏓 ${Date.now() - message.createdTimestamp}ms.`);
    }
}