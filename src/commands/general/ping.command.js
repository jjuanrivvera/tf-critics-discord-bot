module.exports.run = async (message) => {
    message.channel.send(`Pong | 🏓 ${Date.now() - message.createdTimestamp}ms.`);
}

module.exports.config = {
    name: "Ping",
    description: "Get bot response speed",
    command: "ping",
    usage: "ping"
}