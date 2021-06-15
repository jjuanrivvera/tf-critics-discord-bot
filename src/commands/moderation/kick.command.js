const { MemberHelper } = require('../../helpers');

module.exports = {
    name: "Kick",
    command: "kick",
    description: "Kick a user",
    usage: "kick <user> <reason>",
    example: "kick @Alex For being disrespectful",
    requireArgs: 2,
    accessibility: "mod",
	clientPermissions: [
		"SEND_MESSAGES",
        "EMBED_LINKS",
        "KICK_MEMBERS"
	],
    async run(message, args) {
        let member = message.mentions.members.first();

        if (!member) {
            member = message.guild.members.cache.find(member => member.user.tag === args[0]);

            if (!member) {
                return message.channel.send("Provide a valid username").then(msg => msg.delete({ timeout: 3000 }));
            }
        }

        const reason = args.slice(1).join(' ');
        
        if (await MemberHelper.memberIsProtected(member) || member.kickable === false) {
            return message.channel.send("I can't kick this user").then(msg => msg.delete({ timeout: 3000 }));
        } else {
            member.kick(reason);
        }
    }
}