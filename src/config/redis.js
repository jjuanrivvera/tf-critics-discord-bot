const redis = require('redis');

module.exports = async () => {
    return await new Promise((resolve, reject) => {
        const client = redis.createClient({
            url: process.env.REDISCLOUD_URL
        });

        client.on('error', (err) => {
            console.log("Redis error: ", err);
            client.quit();
            reject(err);
        });

        client.on('ready', () => {
            console.log("Redis connected");
            resolve(client)
        });
    });
};

module.exports.expire = async (key, callback) => {
    const pub = await redis.createClient({
        url: process.env.REDISCLOUD_URL
    });

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