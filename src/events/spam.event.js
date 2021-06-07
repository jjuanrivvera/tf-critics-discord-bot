const usersMap = new Map();
const LIMIT = 5;
const DIFF = 5000;
const TIME = 10000;

const { MemberHelper } = require('../helpers');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'message',
    async execute(message) {
        if (message.author.bot || !message.guild) return;

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

                usersMap.set(message.author.id, userData)
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
    }
};