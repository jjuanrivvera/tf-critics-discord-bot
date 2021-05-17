const { MemberHelper } = require('../../helpers/index');

module.exports.run = async (message, args) => {
    if (!args.length) {
        return await message.channel.send("You must provide a username").then(msg => msg.delete({ timeout: 3000 }));
    }

    let member = message.mentions.members.first();

    if (!member) {
        member = await message.guild.members.cache.find(member => member.user.tag === args[0]);

        if (!member) {
            return await message.channel.send("Provide a valid username").then(msg => msg.delete({ timeout: 3000 }));
        }
    }

    const reason = args.slice(1).join(' ');

    if (!reason) {
        return message.channel.send("You must provide a reason").then(msg => msg.delete({ timeout: 3000 }));
    }

    if (await MemberHelper.memberHasModRole(message.member) || message.member.hasPermission('ADMINISTRATOR')) {    
        if (await MemberHelper.memberIsProtected(member) || member.kickable === false) {
            await message.channel.send("I can't kick this user").then(msg => msg.delete({ timeout: 3000 }));
        } else {
            await member.kick();
        }
    } else {
        await message.channel.send("You are ot authorized to perform this action").then(msg => msg.delete({ timeout: 3000 }));
    }
}

module.exports.config = {
    name: "Kick",
    command: "kick",
    description: "Kick a user",
    usage: "kick <use> <reason>",
    example: "kick @Mr.Killer For being Mr.Killer",
    args: true
}