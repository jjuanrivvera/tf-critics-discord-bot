const _ = require("lodash");
const { Profile } = require('../../models');
const { MessageEmbed } = require('discord.js');
const { GuildHelper } = require('../../helpers');

module.exports.run = async (message, args) => {
    let member = message.mentions.members.first();

    if (!member) {
        member = await message.guild.members.cache.find(member => member.user.tag === args[0]);

        if (!member) {
            return message.channel.send(`Point a valid member`).then(msg => msg.delete({ timeout: 3000 }));
        }
    }

    const action = args[1];

    if (!this.config.actions.includes(action)) {
        return message.channel.send(`Use a valid action: add or remove`).then(msg => msg.delete({ timeout: 3000 }));
    }

    const score = args[2];

    if (!_.isNumber(parseInt(score)) || parseInt(score) > this.config.maxScore) {
        return message.channel.send(`Use a valid score`).then(msg => msg.delete({ timeout: 3000 }));
    }

    let profile = await Profile.findOne({
        guildId: message.guild.id,
        userId: member.user.id
    });

    if (!profile) {
        profile = await Profile.create({
            guildId: message.guild.id,
            userId: member.user.id
        });
    }

    let embedMessage = "";

    if (action === "add") {
        let newXp = parseInt(profile.xp) + parseInt(score);
        
        profile.xp = newXp;
        profile.level = GuildHelper.calculateLevel(newXp);

        embedMessage = `${score} of XP added to user ${member.user}`;
    } else {
        if (profile.xp < parseInt(score)) {
            return message.channel.send(`The user does not have that amount of XP`).then(msg => msg.delete({ timeout: 3000 }));
        }

        let newXp = parseInt(profile.xp) - parseInt(score);
        
        profile.xp = newXp;
        profile.level = GuildHelper.calculateLevel(newXp);

        embedMessage = `${score} of XP removed from user ${member.user}`;
    }

    await profile.save();

    const scoreEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
        .setDescription(embedMessage)
        .setTimestamp();

    return message.channel.send(scoreEmbed);
}

module.exports.config = {
    name: "Score",
    description: "Manage user's score",
    command: "score",
    actions: [
        "add",
        "remove"
    ],
    maxScore: 100000,
    requireArgs: 3,
    adminCommand: true,
    example: "score @jjuanrivvera99 add 100",
    usage: "score <user> <add/remove> <amount>"
}