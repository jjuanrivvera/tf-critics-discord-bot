const { MemberHelper } = require('../../helpers');

module.exports.run = async (message, args) => {
    let member = message.mentions.members.first();

    if (!member) {
        member = await message.guild.members.cache.find(member => member.user.tag === args[0]);

        if (!member) {
            return await message.channel.send("Provide a valid username").then(msg => msg.delete({ timeout: 3000 }));
        }
    }

    const reason = args.slice(1).join(' ');
    
    if (await MemberHelper.memberIsProtected(member) || member.kickable === false) {
        await message.channel.send("I can't kick this user").then(msg => msg.delete({ timeout: 3000 }));
    } else {
        await member.kick(reason);
    }
}

module.exports.config = {
    name: "Kick",
    command: "kick",
    description: "Kick a user",
    usage: "kick <user> <reason>",
    example: "kick @Mr.Killer For being Mr.Killer",
    requireArgs: 2,
    modCommand: true,
    args: true
}