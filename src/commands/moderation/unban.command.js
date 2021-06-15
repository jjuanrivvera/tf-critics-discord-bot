module.exports = {
    name: "Unban",
    command: "unban",
    description: "unban a user",
    usage: "unban <user>",
    example: "unban @Slugger",
    requireArgs: 1,
    accessibility: "mod",
	clientPermissions: [
		"SEND_MESSAGES",
        "EMBED_LINKS",
        "BAN_MEMBERS"
	],
    async run(message, args, client) {
        const user = client.users.cache.find(u => u.tag === args[0]);
    
        if (user) {
            await message.guild.members.unban(user.id);
        } else {
            await message.channel.send("Provide a valid username").then(msg => msg.delete({ timeout: 3000 }));
        }
    }
}