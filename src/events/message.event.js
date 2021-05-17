const discordPrefix = process.env.APP_PREFIX || 'tf!';

module.exports = {
	name: 'message',
	async execute(message, client) {
		if (!message.content.startsWith(discordPrefix) || message.author.bot || !message.guild) return;

        const args = message.content.slice(discordPrefix.length).trim().split(" "); // Command arguments
        const command = args.shift().toLowerCase(); // Command name
        const discordCommand = client.commands.get(command); // Get the discord command

        if (discordCommand.config.args && !args.length) {
            let reply = `You didn't provide any arguments!`;
        
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
                await message.channel.send("An error ocurred performing this action").then(msg => msg.delete({ timeout: 3000 }))
            }
        }
	}
};