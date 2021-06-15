const { TranslateHelper } = require('../../helpers');
const DetectLanguage = require('detectlanguage');
const { MessageEmbed } = require('discord.js');
const detectlanguage = new DetectLanguage(process.env.DETECT_LANGUAGE_KEY);

module.exports = {
    name: "Translate",
    command: "translate",
    aliases: ['tr'],
    description: "Translate a text",
    usage: "tr <language> <text>",
    example: "tr es Hi! Guys",
    requireArgs: 2,
    accessibility: "everyone",
	clientPermissions: [
		"SEND_MESSAGES",
        "EMBED_LINKS"
	],
    async run(message, args) {
        const to = args[0];
        const textToTranslate = args.slice(1).join(' ');
        const from = await detectlanguage.detectCode(textToTranslate);
    
        try {
            const { text } = await TranslateHelper.translate(textToTranslate, from, to);
            
            const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription(text);
    
            return message.channel.send(embed);
        } catch (error) {
            return message.channel.send("Language not supported").then(msg => msg.delete({ timeout: 3000 }));
        }
    }
}