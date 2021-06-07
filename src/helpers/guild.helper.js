const { Guild, Profile } = require('../models');
const { Collection, MessageEmbed, WebhookClient } = require('discord.js');

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

    async getMutedRole(guild) {
        const guildModel = await Guild.findOne({
            id: guild.id
        });

        if (guildModel) {
            return guild.roles.cache.find(role => role.id === guildModel.mutedRoleId);
        } else {
            return null;
        }
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

    getNeedExperienceToLevelUp(level) {
        return level * level * 100;
    },

    calculateLevel(experience) {
        let counter = 1;

        if (experience < 100) {
            return 0;
        }

        while (true) {
            const level = (experience / counter) / counter;
            const nextLevel = (experience / (counter + 1)) / (counter + 1);

            if (level === 100) {
                break;
            }

            if (level > 100 && nextLevel < 100) {
                break;
            } else {
                counter++;
            }
        }

        return counter;
    },

    async checkExperience(message, client, guildModel) {
        const {guild, member} = message;
        const guildId = guild.id;
        const userId = member.id;

        const { messageCooldowns } = client;

        if (!messageCooldowns.has(`${guildId}${userId}`)) {
            messageCooldowns.set(`${guildId}${userId}`, new Collection());
        }

        const now = Date.now();
        const timestamps = messageCooldowns.get(`${guildId}${userId}`);
        const cooldownAmount = 60 * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                return;
            }
        }
        
        const levelUpdatesChannel = guild.channels.cache.find(channel => channel.id === guildModel.alerts.levelup);

        const xp = Math.floor(Math.random() * (20 - 10) + 10);

        const result = await Profile.findOneAndUpdate({
            guildId,
            userId
        }, {
            guildId,
            userId,
            $inc: {
                xp: xp
            }
        }, {
            upsert: true,
            new: true
        });

        const calculatedLevel = this.calculateLevel(result.xp);

        if (result.level < calculatedLevel) {
            result.level = calculatedLevel;
            await result.save();
            
            const levelUpEmbed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setThumbnail('https://community.tablotv.com/uploads/default/original/2X/1/1cd4e06b14fa0e4d0c2c5ee6adb245b320bb5754.gif')
                    .setAuthor(member.user.username, member.user.displayAvatarURL())
                    .addFields({
                        name: "Congratulations!!!",
                        value: `${message.author} you have reached level \`${result.level}\``
                    })
                    .setTimestamp();

            if (levelUpdatesChannel) {
                await levelUpdatesChannel.send(levelUpEmbed);
            } else {
                await message.channel.send(levelUpEmbed);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    },

    async log(guild, embed) {
        const guildModel = await Guild.findOne({
            id: guild.id
        });

        if (!guildModel || !guildModel.auditChannel) {
            return null;
        }

        const auditChannel = guild.channels.cache.find(channel => channel.id === guildModel.auditChannel);

        const webhooks = await auditChannel.fetchWebhooks();
		let webhook = webhooks.find(wh => wh.owner.id === guild.client.user.id);

        if (!webhook) {
            webhook = await auditChannel.createWebhook(guild.client.user.username, {
                avatar: guild.client.user.displayAvatarURL(),
                reason: 'Audit Log'
            });

            await guildModel.save();
        }

        try {
            await webhook.send('', {
                username: guild.client.user.username,
                avatarURL: guild.client.user.displayAvatarURL(),
                embeds: [embed],
            });
        } catch (error) {
            console.log(error);
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

        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setDescription(`Welcome aboard. Please state your TF nickname and server played, thanx.`)
            .setTimestamp();

        return welcomeChannel.send(`${member}`, embed);
    }
}