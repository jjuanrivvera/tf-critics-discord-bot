module.exports.run = async (message, args) => {
    try {
        if (args.length) {
            const user = message.mentions.users.first();

            if (!user) {
                message.channel.send("Point a real user").then(msg => msg.delete({ timeout: 3000 }));
                return;
            }

            message.channel.send(user.displayAvatarURL());
            return;
        }

        message.channel.send(message.author.displayAvatarURL());
    } catch(err) {
        console.log(err);
        message.channel.send("Error getting user's avatar").then(msg => msg.delete({ timeout: 3000 }));
    }
}

module.exports.config = {
    name: "Avatar",
    command: "avatar"
}