const { MemberHelper } = require('../../helpers/index');

module.exports.run = async (message, args, client) => {
    if (args.length > 0) {
        if (await MemberHelper.memberHasModRole(message.member, message.guild) || message.member.hasPermission('ADMINISTRATOR')) {
            const user = client.users.cache.find(u => u.tag === args[0]);

            if (user) {
                await message.guild.members.unban(user.id);
            } else {
                await message.channel.send("Provide a valid username").then(msg => msg.delete({ timeout: 3000 }))
            }
        } else {
            await message.channel.send("You are ot authorized to perform this action").then(msg => msg.delete({ timeout: 3000 }))
        }
    } else {
        await message.channel.send("You must provide a username").then(msg => msg.delete({ timeout: 3000 }));
    }
}

module.exports.config = {
    name: "Unban",
    command: "unban"
}