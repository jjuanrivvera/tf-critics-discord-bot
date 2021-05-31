module.exports = {
	name: 'mute',
	execute(message, member) {
		console.log(`${member.user.tag} muted`);
	}
};