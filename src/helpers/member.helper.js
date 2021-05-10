const { Guild } = require('../models');

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
    }
}