const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    id: "string",
    name: "string",
    prefix: "string",
    modRoles: "array",
    protectedRoles: "array",
    mutedRoleId: "string",
    bannedWords: "array",
    alerts: "object",
    features: "array",
    auditChannel: "string",
    webHook: "object"
});

module.exports = mongoose.model('guild', guildSchema);