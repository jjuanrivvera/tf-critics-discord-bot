const redis = require('../config/redis');
const { Guild } = require('../models');

module.exports = {
	name: 'guildMemberAdd',
	async execute(member) {
        const { id, guild } = member;

        const guildModel = await Guild.findOne({
            id: guild.id
        });

        const redisClient = await redis();

        try {
            redisClient.get(`muted-${id}`, async (err, result) => {
                if (err) {
                    console.log("Redis error", err);
                } else if (result) {
                    const role = await guild.roles.cache.find(role => role.id === guildModel.mutedRoleId);

                    if (role) {
                        await member.roles.add(role);
                    }
                }
            });
        } finally {
            redisClient.quit();
        }
	}
};