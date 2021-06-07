const { MessageEmbed } = require('discord.js');

module.exports.run = async (message) => {
    const { guild } = message;

    const { name, owner, region, memberCount} = guild;

    const icon = guild.iconURL({
        size: 1024
    });

    const categories = guild.channels.cache.filter(c => c.type === "category").size;
    const voice = guild.channels.cache.filter(c => c.type === "voice").size;
    const total = guild.channels.cache.filter(c => c.type === "text").size;

    const onlineCount = guild.members.cache.filter(member => member.presence.status === 'online').size
	
	const embed = new MessageEmbed()
		.setAuthor(`${name}`, icon)
		.setThumbnail(icon)
        .setFooter(`Server Created • ${guild.createdAt.toDateString()}`)
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
                value: `**Total:** ${memberCount}\n**Online: **${onlineCount}`,
                inline: true
            },
            {
                name: ":speech_balloon: Channels",
                value: `**Categories:** ${categories}\n**Voice:** ${voice}\n**Text:** ${total}`,
                inline: true
            },
            {
                name: ":closed_lock_with_key: Roles",
                value: `**Total:** ${guild.roles.cache.size}`,
                inline: true
            }
        );

	await message.channel.send(embed);
}

module.exports.config = {
    name: "Server Info",
    description: "Display server info",
    command: "server",
	aliases: ['server-info'],
    requireArgs: 0,
    usage: "server",
	modCommand: false
}