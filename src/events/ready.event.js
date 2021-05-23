const { APP_ACTIVITY, APP_ACTIVITY_TYPE} = require('../config');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Logged in as ${client.user.tag}!`);
		client.user.setActivity(APP_ACTIVITY, { type: APP_ACTIVITY_TYPE });
	}
};