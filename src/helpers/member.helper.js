const redis = require('../config/redis');
const { Case, Guild } = require('../models');
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
            await redis.client.set(redisKey, true, "EX", seconds);

            await redis.expire(redisKey, async () => {
                await Case.deleteOne({
                    type: 'mute',
                    memberId: member.id
                });

                member.roles.remove(role);

                console.log(`${member.user.tag} unmuted`);
            });
        } else {
            await redis.client.set(redisKey, true);
        }

        await member.roles.add(role);

        await Case.create({
            guildId: message.guild.id,
            memberId: member.id,
            target: member.user.tag,
            type: "mute",
            reason: reason,
            responsable: responsable,
            date: new Date()
        });

        message.client.emit('mute', message, member);
    },

    async warn(message, member, reason, responsable) {
        await Case.create({
            guildId: message.guild.id,
            memberId: member.id,
            target: member.user.tag,
            type: "warn",
            reason: reason,
            responsable: responsable,
            date: new Date()
        });

        message.client.emit('warn', message, member);
    }
}