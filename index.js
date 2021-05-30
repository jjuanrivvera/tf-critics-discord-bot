require("dotenv").config();

const bot = require('./src/app');
const db = require('./src/config/db');
const redis = require('./src/config/redis');

db.init();
bot.loadCommands();
bot.loadEvents();
bot.loadRedisListeners(redis);
bot.login();
