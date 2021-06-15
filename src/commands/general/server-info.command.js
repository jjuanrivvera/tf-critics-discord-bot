const { MessageEmbed } = require(`discord.js`);

module.exports = {
    name: "Server Info",
    command: 'server-info',
	description: 'Display user info',
    usage: "server-info",
	aliases: [
        "server"
    ],
	example: "server-info",
    cooldown: 6,
	requireArgs: 0,
	accessibility: "mod",
	clientPermissions: [
		"SEND_MESSAGES",
        "EMBED_LINKS"
	],
	async run(message) {
        const { guild } = message;
        const {
            name,
            owner,
            region,
            memberCount,
            channels,
            members,
            roles,
            createdAt
        } = guild;

        const icon = guild.iconURL({
            size: 1024,
            format: 'png'
        });

        const categories = channels.cache.filter(channel => channel.type === "category");
        const voiceChannels = channels.cache.filter(channel => channel.type === "voice");
        const textChannels = channels.cache.filter(channel => channel.type === "text");

        const onlineMembers = members.cache.filter(member => this.memberIsOnline(member));

        const embed = new MessageEmbed()
            .setAuthor(name, icon)
            .setThumbnail(icon)
            .setFooter(`Server created • ${createdAt.toDateString()}`)
            .addFields(
                {
                    name: ":crown: Owner",
                    value: owner,
                    inline: true
                },
                {
                    name: ":earth_africa: Region",
                    value: region,
                    inline: true
                },
                {
                    name: ":id: Server ID",
                    value: guild.id,
                    inline: true
                },
                {
                    name: ":busts_in_silhouette: Members",
                    value: `**Total:** ${memberCount}\n**Online: **${onlineMembers.size}`,
                    inline: true
                },
                {
                    name: ":speech_balloon: Channels",
                    value: `**Categories:** ${categories.size}\n**Voice:** ${voiceChannels.size}\n**Text:** ${textChannels.size}`,
                    inline: true
                },
                {
                    name: ":closed_lock_with_key: Roles",
                    value: `**Total:** ${roles.cache.size}`,
                    inline: true
                }
            );

        return message.channel.send(embed);
	},
    memberIsOnline(member) {
        let result = false;

        const { presence: { status } } = member;

        if (status === 'online') {
            result= true;
        } else if (status === 'dnd') {
            result= true;
        } else if (status === 'idle') {
            result= true;
        }

        return result;
    }
};