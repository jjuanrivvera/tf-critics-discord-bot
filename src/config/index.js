module.exports = {
    APP_PREFIX: process.env.APP_PREFIX || 'tf!',
    APP_ACTIVITY: process.env.APP_ACTIVITY || 'tf!help',
    APP_ACTIVITY_TYPE: process.env.APP_ACTIVITY_TYPE || 'LISTENING',

    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    DISCORD_CDN: process.env.DISCORD_CDN,
    DISCORD_API: process.env.DISCORD_API,
    DISCORD_BOT_ID: process.env.DISCORD_BOT_ID,

    MONGO_DSN: process.env.MONGO_DSN,
    SENTRY_DSN: process.env.SENTRY_DSN,
    REDISCLOUD_URL: process.env.REDISCLOUD_URL,
    LIBRE_TRANSLATE_API: process.env.LIBRE_TRANSLATE_API,
    LIBRE_TRANSLATE_API_KEY: process.env.LIBRE_TRANSLATE_API_KEY,
    DETECT_LANGUAGE_KEY: process.env.DETECT_LANGUAGE_KEY,
    RAPIDAPI_API_KEY: process.env.RAPIDAPI_API_KEY,
}