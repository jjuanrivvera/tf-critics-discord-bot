const { Guild } = require('../models');

module.exports = {
    async createMutedRole(guild) {
        const guildModel = await Guild.findOne({
            id: guild.id
        });

        const createdRole = await guild.roles.create({
            data: {
              name: 'Muted',
            },
            reason: 'Needed a muted role',
        });

        guildModel.mutedRoleId = createdRole.id;
        await guildModel.save();

        const channels = await guild.channels.cache;

        await channels.each(async channel => {
            try {
                await channel.updateOverwrite(createdRole, { 
                    SPEAK: false,
                    SEND_MESSAGES: false
                });
            } catch (err) {
                console.log(`Could not overwrite ${createdRole.name} permissions over ${channel.id}`);
            }
        });

        return createdRole;
    },

    async refreshMutedRolePermissions(guild) {
        const guildModel = await Guild.findOne({
            id: guild.id
        });

        const role = await guild.roles.cache.find(role => role.id === guildModel.mutedRoleId);

        const channels = await guild.channels.cache;

        await channels.each(async channel => {
            try {
                await channel.updateOverwrite(role, { 
                    SPEAK: false,
                    SEND_MESSAGES: false
                });
            } catch (err) {
                console.log(`Could not overwrite ${createdRole.name} permissions over ${channel.id}`);
            }
        });
    },

    async mute(guild, user, duration, reason) {

    },

    async warn(guild, user, reason) {}
}