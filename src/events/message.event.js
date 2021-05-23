const discordPrefix = process.env.APP_PREFIX || 'tf!';
const Discord = require("discord.js");
const { MemberHelper } = require('../helpers');

module.exports = {
	name: 'message',
	async execute(message, client) {
		if (!message.content.startsWith(discordPrefix) || message.author.bot || !message.guild) return;

        const args = message.content.slice(discordPrefix.length).trim().split(/[ ]+/); // Command arguments
        const command = args.shift().toLowerCase(); // Command name
        const discordCommand = client.commands.get(command)
            || client.commands.find(cmd => cmd.config.aliases && cmd.config.aliases.includes(command)); // Get the discord command
        const { cooldowns } = client;

        if (!cooldowns.has(discordCommand.config.name)) {
            cooldowns.set(discordCommand.config.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(discordCommand.config.name);
        const cooldownAmount = (discordCommand.cooldown || 5) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.channel.send(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${discordCommand.config.name}\` command.`).then(msg => msg.delete({ timeout: 3000 }))
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        if (discordCommand.config.modCommand && (!await MemberHelper.memberHasModRole(message.member) && !message.member.hasPermission('ADMINISTRATOR'))) {
            return;
        }

        if (discordCommand.config.requireArgs > args.length) {
            let reply = `You didn't provide all arguments!`;
        
            if (discordCommand.config.usage) {
                reply += `\nThe proper usage would be: \`${discordPrefix}${discordCommand.config.usage}\``;
            }

            if (discordCommand.config.example) {
                reply += `\nExample: \`${discordPrefix}${discordCommand.config.example}\``;
            }
        
            return message.channel.send(reply);
        }

        if (discordCommand) {
            try {
                await discordCommand.run(message, args, client); //Executes the given command
            } catch (err) {
                console.log(err);
                await message.channel.send("An error ocurred performing this action").then(msg => msg.delete({ timeout: 3000 }));
            }
        }
	}
};