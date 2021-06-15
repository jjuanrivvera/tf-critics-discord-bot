require("dotenv").config();

const bot = require('./src/app');
const db = require('./src/config/db');
const redis = require('./src/config/redis');
const Sentry = require("@sentry/node");
const { Logger } = require('./src/util');
const { SENTRY_DSN } = require('./src/config');

if (process.env.NODE_ENV !== "development") {
    process.on('uncaughtException', error => Logger.log('error', error));
}

Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 1.0,
});

db.init();
bot.loadCommands();
bot.loadEvents();
bot.loadRedisListeners(redis);
bot.login();
