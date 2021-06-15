const { APP_ACTIVITY, APP_ACTIVITY_TYPE} = require('../config');
const { Logger } = require('../util');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		Logger.log('info',`Logged in as ${client.user.tag}!`);
		client.user.setActivity(APP_ACTIVITY, { type: APP_ACTIVITY_TYPE });
	}
};