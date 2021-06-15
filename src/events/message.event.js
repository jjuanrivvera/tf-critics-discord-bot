const { Collection } = require("discord.js");
const { MemberHelper } = require('../helpers');
const { Guild } = require('../models');
const { Logger } = require('../util');
const { APP_PREFIX } = require('../config');
const usersMap = new Map();
const LIMIT = 5;
const DIFF = 5000;
const TIME = 10000;

module.exports = {
	name: 'message',
    allowedGlobalCommands: [
        "help",
        "prefix"
    ],
	async execute(message, client) {
        if (message.author.bot || !message.guild) return;

		this.checkForSpam();
        
        const { guild, channel, member } = message;
        const { cooldowns } = client;

        const guildModel = await this.getGuildModel(guild);

		this.checkBannedWords(guildModel, member);
		await this.calculateExperience(guildModel, message, client);

		let prefix = null;
		let command = null;
		let args = null;

		if (message.content.startsWith(guildModel.prefix)) {
			prefix = guildModel.prefix
			
			args = message.content.slice(prefix.length).trim().split(/ +/);
			command = args.shift().toLowerCase();
		} else if (message.content.startsWith(APP_PREFIX)) {
			prefix = APP_PREFIX;

			args = message.content.slice(prefix.length).trim().split(/ +/);
			command = args.shift().toLowerCase();

			if (!this.allowedGlobalCommands.includes(command)) return;
		} else {
			return;
		};

        const discordCommand = client.commands.get(command) ||
            client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command)); // Get the discord command
        
        if (!discordCommand) return;

        if (discordCommand.requireArgs > args.length) {
            let reply = `You didn't provide all arguments!`;
        
            if (discordCommand.usage) {
                reply += `\nThe proper usage would be: \`${guildModel.prefix}${discordCommand.usage}\``;
            }

            if (discordCommand.example) {
                reply += `\nExample: \`${guildModel.prefix}${discordCommand.example}\``;
            }
        
            return message.channel.send(reply);
        }

        const commandHasCooldown = this.commandHasCooldown(discordCommand, cooldowns, message);

		if (commandHasCooldown) {
			const {
				timeLeft
			} = commandHasCooldown;

			return message.channel.send(
				`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${discordCommand.name}\` command.`
			).then(msg => msg.delete({
				timeout: 3000
			}));
		}

		if (!this.clientHasPermissions(discordCommand, guild, channel)) {
			Logger.log(
				'warn',
				`The bot does not have the right permissions to execute ${discordCommand.name} on ${guild.name} - #${channel.name}`
			);
			return;
		}

		if (!this.userHasAccess(discordCommand, member, guild)) {
			Logger.log('warn',`The user ${member.user.tag} does not have the right permissions to execute "${discordCommand.name}"`);
			return;
		}

        try {
            discordCommand.run(message, args, client, guildModel); //Executes the given command
        } catch (error) {
            Logger.log('error', error);
            return message.channel.send("An error ocurred performing this action").then(msg => msg.delete({ timeout: 3000 }));
        }
	},
    clientHasPermissions(command, guild, channel) {
		const botPermissionsIn = guild.me.permissionsIn(channel).toArray();

		for (const permission of command.clientPermissions) {
			if (!botPermissionsIn.includes(permission)) return false;
		}

		return true;
	},
	userHasAccess(command, member, guild) {
        let result = true;

        if (command.accessibility === "admin" && !member.hasPermission("ADMINISTRATOR")) {
            result = false;
        } else if (command.accessibility === "mod" && MemberHelper.memberHasModRole(member) && !member.hasPermission("ADMINISTRATOR")) {
            result = false;
        } else if (command.accessibility === "owner" && guild.owner.id !== member.user.id) {
            result = false;
        }

        return result;
    },
	commandHasCooldown(command, cooldowns, message) {
		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 6) * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return {
					timeLeft
				};
			} else {
				return false;
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	},
	async getGuildModel(guild) {
		let guildModel = await Guild.findOne({
			id: guild.id
		});

		if (!guildModel) {
			guildModel = await Guild.create({
				id: guild.id,
                name: guild.name,
                prefix: "!",
                bannedWords: [
                    "fuck",
                    "dick",
                    "bitch"
                ]
			});
		};

		return guildModel;
	},
	checkBannedWords(guildModel, member) {
		if (member.hasPermission("ADMINISTRATOR")) return;
		
		for (const bannedWord of guildModel.bannedWords) {
            if (message.content.toLowerCase().includes(bannedWord.toLowerCase())) {
                await MemberHelper.warn(message, message.member, "Automod banned words detection", message.client.user.tag);

                const warnEmbed = new MessageEmbed().setColor("#E74C3C")
                    .setDescription(`The user ${message.author} was warned for "Automod banned words detection"`);

                await message.channel.bulkDelete(1);
                await message.channel.send(warnEmbed);
            }
        }
	},
	checkForSpam() {
		if (usersMap.has(message.author.id)) {
            const userData = usersMap.get(message.author.id);
            const { lastMessage, timer } = userData;
            const difference = message.createdTimestamp - lastMessage.createdTimestamp;
            let msgCount = userData.msgCount;

            if (difference > DIFF) {
                clearTimeout(timer);

                userData.msgCount = 1;
                userData.lastMessage = message;
                userData.timer = setTimeout(() => {
                    usersMap.delete(message.author.id);
                }, TIME);

                usersMap.set(message.author.id, userData);
            } else {
                ++msgCount;

                if (parseInt(msgCount) === LIMIT) {

                    await MemberHelper.warn(message, message.member, "Automod spam detection", message.client.user.tag);

                    const warnEmbed = new MessageEmbed().setColor("#E74C3C")
                        .setDescription(`The user ${message.author} was warned for "Automod spam detection" by ${message.client.user}`);

                    await message.channel.bulkDelete(LIMIT);
                    await message.channel.send(warnEmbed);
                } else {
                    userData.msgCount = msgCount;
                    usersMap.set(message.author.id, userData);
                }
            }
        } else {
            let fn = setTimeout(() => {
                usersMap.delete(message.author.id);
            }, TIME);

            usersMap.set(message.author.id, {
                msgCount: 1,
                lastMessage: message,
                timer: fn
            });
        }
	},
	async calculateExperience(guildModel, message, client) {
		if (!guildModel || !guildModel.features.includes('level-system')) return;

        await GuildHelper.checkExperience(message, client, guildModel);
	}
};