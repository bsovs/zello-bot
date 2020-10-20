const reply = require('./reply');

module.exports = {
	excluded: true,
	name: 'gyazo',
	description: 'Cleanup Gyazo Links',
	execute(message) {
		message.delete();
		reply.editLink(message);
	}
};