const reply = require('./reply');

module.exports = {
	excluded: true,
	deprecated: true,
	name: 'cleanup',
	description: 'Cleanup Stuff.',
	execute(message) {
		//message.delete();
		//reply.editLink(message);
	}
};