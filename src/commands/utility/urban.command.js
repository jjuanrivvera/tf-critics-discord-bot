const axios = require('axios');
const { MessageEmbed } = require(`discord.js`);
const { RAPIDAPI_API_KEY } = require('../../config');

module.exports = {
    name: "Urban",
	command: 'urban',
	description: 'Get the definition of urban words',
    usage: `urban <word>`,
	aliases: [],
	example: "urban sisas",
    cooldown: 6,
	requireArgs: 1,
	accessibility: "everyone",
	clientPermissions: [
		"SEND_MESSAGES",
        "EMBED_LINKS"
	],
	async run(message, args) {
        const word = args[0];

        const headers = {
            "x-rapidapi-key": RAPIDAPI_API_KEY,
	        "x-rapidapi-host": "mashape-community-urban-dictionary.p.rapidapi.com",
            "useQueryString": true
        };

        const response = await axios({
            method: "GET",
            url: "https://mashape-community-urban-dictionary.p.rapidapi.com/define",
            headers: headers,
            params: {
                term: word
            }
        });

        const { data: { list } } = response;
        const result = list[0];

        if (!result) {
            const reply = new MessageEmbed().setDescription(`No results found for ${word}`);
            return message.channel.send(reply);
        }

        const embed = new MessageEmbed()
            .setTitle(`Definition of ${word}`)
            .setColor("GREEN")
            .setDescription(result.definition)
            .setFooter(`Author: ${result.author}`)
            .setURL(result.permalink)
            .setThumbnail('https://images-ext-2.discordapp.net/external/HMmIAukJm0YaGc2BKYGx5MuDJw8LUbwqZM9BW9oey5I/https/i.imgur.com/VFXr0ID.jpg')
            .addFields(
                {
                    name: "Ejemplo",
                    value: result.example
                },
                {
                    name: ":thumbsup:",
                    value: result.thumbs_up,
                    inline: true
                },
                {
                    name: ":thumbsdown:",
                    value: result.thumbs_down,
                    inline: true
                }
            );

        return message.channel.send(embed);
    }
};