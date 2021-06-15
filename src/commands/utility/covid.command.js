const axios = require('axios');
const _ = require('lodash');
const { MessageEmbed } = require(`discord.js`);

module.exports = {
    name: "Covid",
	command: 'covid',
	description: 'Display covid information',
    usage: `covid [country]`,
	aliases: [],
	example: "covid colombia",
    cooldown: 6,
	requireArgs: 0,
	accessibility: "everyone",
	clientPermissions: [
		"SEND_MESSAGES",
        "EMBED_LINKS"
	],
	async run(message, args) {
        let country = _.startCase(args.join(" ")) || 'Global';

        const response = await axios({
            method: "GET",
            url: "https://covid-api.mmediagroup.fr/v1/cases",
            headers: {
                "Content-Type": "application/json"
            },
            params: {
                country: country
            }
        });

        const data = response.data.All || response.data.Global.All;

        if (response.data.Global) {
            country = "Global";
        }

        const confirmed = data.confirmed;
        const deaths = data.deaths;
        const deathsPercentage = ((deaths / confirmed) * 100).toFixed(2);
        const recovered = data.recovered;
        const recoveredPercentage = ((recovered / confirmed) * 100).toFixed(2);

        const embed = new MessageEmbed()
            .setTitle(`COVID-19 Statistics for ${country}`)
            .setThumbnail('https://media.discordapp.net/attachments/239446877953720321/691020838379716698/unknown.png')
            .addFields(
                {
                    name: "Cases",
                    value: Intl.NumberFormat().format(confirmed),
                    inline: true
                },
                {
                    name: "Deaths",
                    value: `${Intl.NumberFormat().format(deaths)} (${deathsPercentage}%)`,
                    inline: true
                },
                {
                    name: "Recovered",
                    value: `${Intl.NumberFormat().format(recovered)} (${recoveredPercentage}%)`,
                    inline: true
                }
            );

        return message.channel.send(embed);
	}
};