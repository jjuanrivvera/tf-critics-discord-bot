const { MemberHelper } = require('../../helpers');

module.exports = {
    name: "Warn",
    command: "warn",
    description: "Warn a user",
    usage: "warn <user> <reason>",
    example: "warn @Alex For breaking the rules",
    cooldown: 7,
    requireArgs: 2,
    accessibility: "mod",
	clientPermissions: [
		"SEND_MESSAGES",
        "EMBED_LINKS"
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
    
        if (await MemberHelper.memberIsProtected(member) || member.kickable === false) {
            return message.channel.send("I can't warn this user").then(msg => msg.delete({ timeout: 3000 }));
        } else {
            MemberHelper.warn(message, member, reason, message.author.tag);
        }
    }
}