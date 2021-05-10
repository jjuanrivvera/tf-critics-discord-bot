const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
    id: "string",
    name: "string",
    prefix: "string",
    modRoles: "array",
    protectedRoles: "array",
    mutedRoleId: "string"
});

module.exports = mongoose.model('guild', serverSchema);