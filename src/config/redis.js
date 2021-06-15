const redis = require('redis');
const { Logger } = require('../util');

const client = redis.createClient({
    url: process.env.REDISCLOUD_URL
});

const subscribe = redis.createClient({
    url: process.env.REDISCLOUD_URL
});

client.on('error', (err) => {
    Logger.log('error', "Redis error: ", err);
});

client.on('ready', () => {
    Logger.log('info',"Redis connected");
});

module.exports = {
    client: client,
    subscribe: subscribe,
    async expire(key, callback) {
        const pub = this.client;
        const sub = this.subscribe;
        
        pub.send_command('config', ['set','notify-keyspace-events','Ex'], async (e, r) => {
            sub.subscribe(`__keyevent@0__:expired`, function() {
                Logger.log('info',` [i] Subscribed to "${key}" expired events: ` + r);
        
                sub.on('message', function (channel, message) {
                    callback(message, this);
                });
            });
        });
    }
};