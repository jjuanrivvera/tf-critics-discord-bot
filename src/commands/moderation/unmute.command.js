const { MemberHelper } = require('../../helpers');
const { Case, Guild } = require('../../models');
const { MessageEmbed } = require('discord.js');
const redis = require('../../config/redis');

module.exports = {
    name: "Unmute",
    command: "unmute",
    description: "Unmute a user",
    usage: "unmute <user> [reason]",
    example: "unmute Alex#1234 User does not deserve the mute",
    requireArgs: 1,
    accessibility: "mod",
    clientPermissions: [
		"SEND_MESSAGES",
        "EMBED_LINKS",
        "MANAGE_ROLES"
	],
    async run(message, args) {
        const guildModel = await Guild.findOne({
            id: message.guild.id
        });
    
        const role = message.guild.roles.cache.find(role => role.id === guildModel.mutedRoleId);
    
        let member = message.mentions.members.first();
    
        if (!member) {
            member = await message.guild.members.cache.find(member => member.user.tag === args[0]);
    
            if (!member) {
                return message.channel.send(`Provide a valid user`).then(msg => msg.delete({ timeout: 3000 }));
            }
        }
    
        const reason = args.slice(1).join(' ') || `No reason specified`;
    
        if (! await MemberHelper.isMuted(member)) {
            return message.channel.send("This user is not muted").then(msg => msg.delete({ timeout: 3000 }));
        } else {
            member.roles.remove(role);
    
            const caseItem = await Case.findOne({
                type: 'mute',
                guildId: message.guild.id,
                memberId: member.id,
                status: "active"
            });
    
            caseItem.status = "inactive";
            await caseItem.save();
    
            redis.client.del(`muted-${message.guild.id}-${member.user.id}`);
    
            message.client.emit('unmute', member, reason, caseItem, message.author.tag);
    
            const unMutedEmbed = new MessageEmbed().setColor("#95A5A6")
                .setDescription(`The user ${member.user.tag} was unmuted by ${message.author.tag}`);
    
            return message.channel.send(unMutedEmbed);
        }
    }
}