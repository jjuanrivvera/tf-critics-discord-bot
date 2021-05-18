const { TranslateHelper } = require('../../helpers');
const DetectLanguage = require('detectlanguage');
const { MessageEmbed } = require('discord.js');
const detectlanguage = new DetectLanguage(process.env.DETECT_LANGUAGE_KEY);

module.exports.run = async (message, args) => {
    if (args.length < 2) {
        let reply = `You didn't provide any arguments!`;
        
            if (this.config.usage) {
                reply += `\nThe proper usage would be: \`${discordPrefix}${this.config.usage}\``;
            }

            if (this.config.example) {
                reply += `\nExample: \`${discordPrefix}${this.config.example}\``;
            }
        
            return message.channel.send(reply);
    }

    const to = args[0];
    const textToTranslate = args.slice(1).join(' ');
    const from = await detectlanguage.detectCode(textToTranslate);
    try {
        const text = await TranslateHelper.translate(textToTranslate, from, to);
        
        const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setDescription(text);

        await message.channel.send(embed);
    } catch (error) {
        await message.channel.send("Language not supported").then(msg => msg.delete({ timeout: 3000 }));
    }
}

module.exports.config = {
    name: "Translate",
    command: "translate",
    aliases: ['tr'],
    description: "Translate a text",
    usage: "tr <language> <text>",
    example: "tr es Hi! Guys",
    args: true
}