const { join } = require('path');
const { createCanvas, loadImage } = require('canvas');
const { Profile } = require('../../models');
const { GuildHelper } = require('../../helpers');
const { MessageAttachment } = require('discord.js');

module.exports.run = async (message, args) => {
    let member = message.mentions.members.first();

    if (!member) {
        member = await message.guild.members.cache.find(member => member.user.tag === args[0]);

        if (!member) {
            member = message.member;
        }
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

    const neededXpcurrentLevel = GuildHelper.getNeedExperienceToLevelUp(profile.level);
    const neededXp = GuildHelper.getNeedExperienceToLevelUp(profile.level + 1) - neededXpcurrentLevel;
    let currentXp = profile.xp - neededXpcurrentLevel;

    if (currentXp < 0) {
        currentXp = profile.xp;
    }

    const canvas = createCanvas(1400, 333);

    const context = canvas.getContext("2d");
    const background = await loadImage(join(__dirname, "..", "..", "public", "img", "rank-banner.png"));
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.lineWidth = 4;
    context.strokeStyle = "#ffffff";
    context.globalAlpha = 0.2;
    context.fillStyle = "#000000";
    context.fillRect(180, 216, 900, 65);
    context.fill();
    context.globalAlpha = 1;
    context.strokeRect(180, 216, 900, 65);
    context.stroke();

    context.fillStyle = "#e67e22";
    context.globalAlpha = 0.6;
    context.fillRect(180, 216, ((100 / neededXp) * currentXp) * 9, 65);
    context.fill();
    context.globalAlpha = 1;

    context.font = "30px Roboto";
    context.textAlign = "center";
    context.fillStyle = "#ffffff";
    context.fillText(`${currentXp} / ${neededXp} XP`, 650, 260);

    context.font = "50px Roboto";
    context.textAlign = "center";
    context.fillText(member.user.tag, 650, 80);

    context.font = "60px Roboto";
    context.textAlign = "left";
    context.fillText("Level: ", 300, 180);
    context.fillText(profile.level, 470, 180);

    context.textAlign = "right";
    context.fillText(`Total: ${profile.xp}`, 1070, 180);

    context.arc(170, 160, 120, 0, Math.PI * 2, true);
    context.lineWidth = 6;
    context.strokeStyle = "#ffffff";
    context.stroke();
    context.closePath();
    context.clip();

    const avatar = await loadImage(member.user.displayAvatarURL({ format: "jpg"}));
    context.drawImage(avatar, 40, 40, 250, 250);

    const attatchment = new MessageAttachment(canvas.toBuffer(), "rank.png");

    return message.channel.send(``, attatchment);
}

module.exports.config = {
    name: "Rank",
    description: "Get user rank",
    command: "rank",
    requireArgs: 0,
    aliases: ['level', 'ranking'],
    usage: "rank [user]"
}