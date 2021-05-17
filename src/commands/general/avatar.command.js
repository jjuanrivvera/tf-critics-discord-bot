const { MessageEmbed } = require('discord.js');

module.exports.run = async (message, args) => {
    let user = null;

    if (args.length) {
        user = message.mentions.users.first();

        if (!user) {
            user = await message.guild.members.cache.find(member => member.user.tag === args[0]);

            if (!user) {
                return await message.channel.send("Provide a valid username").then(msg => msg.delete({ timeout: 3000 }));
            }
        }
    } else {
        user = message.author;
    }

    const avatarEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setAuthor(user.tag, user.displayAvatarURL())
        .setImage(user.displayAvatarURL({ dynamic: true, size: 256}));

    await message.channel.send(avatarEmbed);
}

module.exports.config = {
    name: "Avatar",
    command: "avatar",
    description: "Get user avatar",
    usage: "avatar [user]",
    example: "avatar @jjuanrivvera99"
}