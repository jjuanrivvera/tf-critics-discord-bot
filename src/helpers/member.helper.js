const { join } = require('path');
const redis = require('../config/redis');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const { Case, Guild, Profile } = require('../models');
const GuildHelper = require('./guild.helper');

module.exports = {
    async memberIsProtected(member) {
        const guildModel = await Guild.findOne({ id: member.guild.id });
        
        const hasRole = member.roles.cache.some(role => guildModel.protectedRoles.includes(role.name));

        if (hasRole) {
            return true;
        } else {
            return false;
        }
    },

    async memberHasModRole(member) {
        const guildModel = await Guild.findOne({ id: member.guild.id });
        
        const hasRole = member.roles.cache.some(role => guildModel.modRoles.includes(role.name));

        if (hasRole) {
            return true;
        } else {
            return false;
        }
    },

    async memberHasRole(member, role) {
        const hasRole = member.roles.cache.some(role.name === role);

        if (hasRole) {
            return true;
        } else {
            return false;
        }
    },

    async isMuted(member) {
        const guildModel = await Guild.findOne({ id: member.guild.id });
        const role = member.roles.cache.find(role => role.id === guildModel.mutedRoleId);

        if (role) {
            return true;
        } else {
            return false;
        }
    },

    async mute(message, member, durationString, reason, responsable) {
        const role = await GuildHelper.getMutedRole(message.guild);

        const durations = {
            m: 60,
            h: 60 * 60,
            d: 60 * 60 * 24,
            life: -1
        };

        const durationType = durationString.match(/[a-zA-Z]+/g);
        const duration = durationString.match(/\d+/g);
        const seconds = duration * durations[durationType];

        const redisKey = `muted-${message.guild.id}-${member.user.id}`;

        if (seconds > 0) {
            redis.client.set(redisKey, true, "EX", seconds);

            await redis.expire(redisKey, async () => {
                const caseItem = await Case.findOne({
                    type: 'mute',
                    memberId: member.id,
                    status: "active",
                    guildId: member.guild.id
                });

                caseItem.status = "inactive";
                await caseItem.save();

                member.roles.remove(role);

                message.client.emit('unmute', member, "Auto unmute", caseItem, message.client.user.tag);
            });
        } else {
            redis.client.set(redisKey, true);
        }

        await member.roles.add(role);

        const caseItem = await Case.create({
            guildId: message.guild.id,
            memberId: member.id,
            target: member.user.tag,
            type: "mute",
            reason: reason,
            responsable: responsable,
            status: "active",
            date: new Date()
        });

        try {
            await member.user.send(`You were muted ${durationString} from ${message.guild.name}\n**Reason:** ${reason}`);
        } catch (error) {
            console.log(`Could not DM ${member.user.tag}`);
        }

        message.client.emit('mute', member, reason, durationString, caseItem);
    },

    async warn(message, member, reason, responsable) {
        const caseItem = await Case.create({
            guildId: message.guild.id,
            memberId: member.id,
            target: member.user.tag,
            type: "warn",
            reason: reason,
            responsable: responsable,
            status: "active",
            date: new Date()
        });

        try {
            await member.user.send(`You were warned in ${message.guild.name}\n**Reason:** ${reason}`);
        } catch (error) {
            console.log(`Could not DM ${member.user.tag}`);
        }

        message.client.emit('warn', message, member, reason, caseItem);
    },

    async clearWarnings(guild, member) {
        await Case.updateMany({
            guildId: guild.id,
            memberId: member.id,
            type: "warn",
            status: "active"
        }, {
            status: "inactive"
        });
    },

    async getRankNumber(guild, member) {
        const profiles = await Profile.find({
            guildId: guild.id
        }).sort({ xp: -1});

        for (const [index, profile] of profiles.entries()) {
            if (member.user.id === profile.userId) {
                return index + 1;
            }
        }
    },

    async welcome(guild, member) {
        const guildModel = await Guild.findOne({
            id: guild.id
        });

        let welcomeChannel = null;

        if (!guildModel.alerts.welcome) {
            welcomeChannel = guild.channels.cache.find(channel => channel.name === "tf-global-critics");
        } else {
            welcomeChannel = guild.channels.cache.find(channel => channel.id === guildModel.alerts.welcome);
        }

        if (!welcomeChannel) {
            return;
        }

        const attachment = new MessageAttachment(join(__dirname, "..", "public", "img", "rank-banner.png"), 'banner.png');

        const rulesChannel = guild.channels.cache.find(channel => channel.name === "rules");
        const cheatersChannel = guild.channels.cache.find(channel => channel.name === "tf-cheaters-reports");
        const photoChannel = guild.channels.cache.find(channel => channel.name === "tf-photo-gallery");
        const videoChannel = guild.channels.cache.find(channel => channel.name === "tf-video-gallery");

        const embed = new MessageEmbed()
            .setTitle(`Welcome aboard!`)
            .setColor('BLUE')
            .setDescription(`Please state your TF nickname and server played, thanx.`)
            .attachFiles(attachment)
            .setImage('attachment://banner.png');

        if (rulesChannel) {
            embed.addField(`You may want to check our rules`, `${rulesChannel}`);
        }

        if (photoChannel) {
            embed.addField(`Share your battle screenshots`, `${photoChannel}`);
        }

        if (videoChannel) {
            embed.addField(`Share TF videos here`, `${videoChannel}`);
        }

        if (cheatersChannel) {
            embed.addField(`Cheaters?`, `Report them here ${cheatersChannel}`);
        }

        await member.user.send(embed);
        return welcomeChannel.send(`${member}`, embed);
    },

    async leave(guild, member) {
        const guildModel = await Guild.findOne({
            id: guild.id
        });

        let leavesChannel = null;

        if (!guildModel.alerts.leaves) {
            leavesChannel = guild.channels.cache.find(channel => channel.name === "tf-global-critics");
        } else {
            leavesChannel = guild.channels.cache.find(channel => channel.id === guildModel.alerts.leaves);
        }

        if (!leavesChannel) {
            return;
        }

        const embed = new MessageEmbed()
            .setColor('RED')
            .setDescription(`${member.user.tag} has left the building...hope he did not trip his foot on his way out...oops`)
            .setTimestamp();

        return leavesChannel.send(embed);
    }
}