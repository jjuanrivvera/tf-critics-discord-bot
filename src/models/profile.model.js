const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    guildId: "string",
    userId: "string",
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 0
    },
    warningCount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('profile', profileSchema);