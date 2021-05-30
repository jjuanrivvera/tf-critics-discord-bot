const mongoose = require('mongoose');

const Counter = require("./counter.model");

const caseSchema = new mongoose.Schema({
    guildId: "string",
    memberId: "string",
    number: "string",
    type: "string",
    reason: "string",
    target: "string",
    responsable: "string",
    date: {
        type: Date
    }
});

caseSchema.pre('save', function(next) {
    var doc = this;
    Counter.findOneAndUpdate({_id: 'caseNumber', guildId: this.guildId}, {$inc: { seq: 1} }, function(error, counter) {
        if (error) {
            return next(error);
        }

        doc.number = counter.seq;
        next();
    });
});

module.exports = mongoose.model('case', caseSchema);