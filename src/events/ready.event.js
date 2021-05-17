module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Logged in as ${client.user.tag}!`);
		client.user.setActivity(process.env.APP_ACTIVITY, { type: process.env.APP_ACTIVITY_TYPE });
	}
};