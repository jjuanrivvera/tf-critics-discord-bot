const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    id: "string",
    name: "string",
    prefix: "string",
    modRoles: "array",
    protectedRoles: "array",
    mutedRoleId: "string",
    prefix: "string"
});

module.exports = mongoose.model('guild', guildSchema);