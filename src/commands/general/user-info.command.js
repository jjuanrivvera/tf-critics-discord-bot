const moment = require('moment');
const { MessageEmbed } = require(`discord.js`);

module.exports = {
    name: "User Info",
	command: 'user-info',
	description: 'Display user info',
    usage: "user-info [user]",
	aliases: [
        "user",
        "whois"
    ],
	example: "user-info @jjuanrivvera99",
    cooldown: 6,
	requireArgs: 0,
	accessibility: "everyone",
	clientPermissions: [
		"SEND_MESSAGES",
        "EMBED_LINKS"
	],
	run(message, args) {
        let member = null;

		if (args.length) {
            member = message.mentions.members.first();

            if (!member) {
                member = message.guild.members.cache.find(member => member.user.tag === args[0]);

                if (!member) {
                    return message.channel.send("Provide a valid username").then(msg => msg.delete({ timeout: 3000 }));
                }
            }
		} else {
			member = message.member;
		}

        const roles = member.roles.cache
            .filter(role => role.id !== message.guild.id)
            .map(role => `<@&${role.id}>`).join(" ") || 'none';

        const permissions = member.permissions.toArray().join(", ");

        const joined = moment(member.joinedAt).format("LLLL");
        const created = moment(member.user.createdAt).format("LLLL");

        const embed = new MessageEmbed()
			.setAuthor(member.user.tag, member.user.displayAvatarURL())
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setTimestamp()
            .setFooter(`ID: ${member.user.id}`)
            .addFields(
                {
                    name: "Joined",
                    value: `${joined}`,
                    inline: true
                },
                {
                    name: "Registered",
                    value: created,
                    inline: true
                },
                {
                    name: `Roles (${member.roles.cache.size - 1})`,
                    value: roles
                },
                {
                    name: `Permissions`,
                    value: permissions
                }
            );

		return message.channel.send(embed);
	}
};