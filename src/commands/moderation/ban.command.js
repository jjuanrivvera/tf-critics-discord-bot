const { MemberHelper } = require('../../helpers/index');

module.exports.run = async (message, args) => {
    if (args.length <= 0) {
        return message.channel.send("You must provide a username").then(msg => msg.delete({ timeout: 3000 }));
    }

    let member = message.mentions.members.first();

    if (!member) {
        member = await message.guild.members.cache.find(member => member.user.tag === args[0]);

        if (!member) {
            return message.channel.send("Provide a valid username").then(msg => msg.delete({ timeout: 3000 }));
        }
    }

    const reason = args.slice(1).join(' ');

    if (!reason) {
        return message.channel.send("You must provide a reason").then(msg => msg.delete({ timeout: 3000 }));
    }

    if (await MemberHelper.memberHasModRole(message.member) || message.member.hasPermission('ADMINISTRATOR')) {

        if (await MemberHelper.memberIsProtected(member) || member.bannable === false) {
            await message.channel.send("I can't ban this user").then(msg => msg.delete({ timeout: 3000 }));
        } else {
            await message.guild.members.ban(member);
        }
    } else {
        await message.channel.send("You are ot authorized to perform this action").then(msg => msg.delete({ timeout: 3000 }));
    }
}

module.exports.config = {
    name: "Ban",
    command: "ban",
    description: "Ban a user",
    usage: "ban <user> <reason>",
    example: "ban @Slugger For being Slugger",
    args: true
}