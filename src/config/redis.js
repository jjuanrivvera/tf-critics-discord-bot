const redis = require('redis');

const client = redis.createClient({
    url: process.env.REDISCLOUD_URL
});

const subscribe = redis.createClient({
    url: process.env.REDISCLOUD_URL
});

client.on('error', (err) => {
    console.log("Redis error: ", err);
});

client.on('ready', () => {
    console.log("Redis connected");
});

module.exports = {
    client: client,
    subscribe: subscribe,
    async expire(key, callback) {
        const pub = this.client;
        const sub = this.subscribe;
        
        pub.send_command('config', ['set','notify-keyspace-events','Ex'], async (e, r) => {
            sub.subscribe(`__keyevent@0__:expired`, function() {
                console.log(` [i] Subscribed to "${key}" expired events: ` + r);
        
                sub.on('message', function (channel, message) {
                    callback(message, this);
                });
            });
        });
    }
};