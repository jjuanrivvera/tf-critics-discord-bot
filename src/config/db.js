const mongoose = require("mongoose");
const dsn = process.env.MONGO_DSN;

module.exports = {
    init() {
        mongoose.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
};