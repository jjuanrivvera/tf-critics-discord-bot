const redis = require('redis');

const client = redis.createClient({
    url: process.env.REDISCLOUD_URL
});

client.on('error', (err) => {
    console.log("Redis error: ", err);
    client.quit();
});

client.on('ready', () => {
    console.log("Redis connected");
});

module.exports = {
    client: client,
    async expire(key, callback) {
        const pub = this.client;
        const sub = pub;
        
        pub.send_command('config', ['set','notify-keyspace-events','Ex'], async (e, r) => {
            sub.subscribe(`__keyevent@0__:expired`, function(){
                console.log(` [i] Subscribed to "${key}" event channel : ` + r);
        
                sub.on('message',function (channel, message) {
                    callback(message)
                });
            })
        });
    }
};