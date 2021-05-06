const { Guild } = require('../models');

module.exports = {
    async memberHasModRole(member, guild) {
        const guildModel = await Guild.findOne({ id: guild.id });
        
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
    }
}