const { MemberHelper } = require('../helpers/index');

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

    if (await MemberHelper.memberHasModRole(message.member, message.guild) || message.member.hasPermission('ADMINISTRATOR')) {
    
        if (await MemberHelper.memberHasModRole(member, message.guild) || member.kickable === false) {
            await message.channel.send("I can't kick this user").then(msg => msg.delete({ timeout: 3000 }))
        } else {
            await member.kick();
        }
    } else {
        await message.channel.send("You are ot authorized to perform this action").then(msg => msg.delete({ timeout: 3000 }))
    }
}

module.exports.config = {
    name: "Kick",
    command: "kick"
}