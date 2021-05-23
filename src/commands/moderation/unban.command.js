const { MemberHelper } = require('../../helpers/index');

module.exports.run = async (message, args, client) => {
    const user = client.users.cache.find(u => u.tag === args[0]);

    if (user) {
        await message.guild.members.unban(user.id);
    } else {
        await message.channel.send("Provide a valid username").then(msg => msg.delete({ timeout: 3000 }));
    }
}

module.exports.config = {
    name: "Unban",
    command: "unban",
    description: "unban a user",
    usage: "unban <user>",
    example: "unban @Slugger",
    requireArgs: 1,
    modCommand: true,
    args: true
}