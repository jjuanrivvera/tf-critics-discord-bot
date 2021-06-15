const { MemberHelper } = require('../../helpers/index');

module.exports = {
    name: "Ban",
    command: "ban",
    description: "Ban a user",
    usage: "ban <user> <reason>",
    example: "ban @Slugger For being Slugger",
    requireArgs: 2,
    accessibility: "mod",
	clientPermissions: [
		"SEND_MESSAGES",
        "EMBED_LINKS",
        "BAN_MEMBERS"
	],
    async run(message, args) {
        let member = message.mentions.members.first();

        if (!member) {
            member = await message.guild.members.cache.find(member => member.user.tag === args[0]);

            if (!member) {
                return message.channel.send("Provide a valid username").then(msg => msg.delete({ timeout: 3000 }));
            }
        }

        const reason = args.slice(1).join(' ');

        if (await MemberHelper.memberIsProtected(member) || member.bannable === false) {
            return message.channel.send("I can't ban this user").then(msg => msg.delete({ timeout: 3000 }));
        } else {
            await member.ban({
                reason: reason
            });
        }
    }
}