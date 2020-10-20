const reply = require('./reply');

module.exports = {
	name: 'help',
	description: 'View a list of commands',
	execute(message, commands) {
		commands = commands.map(cmd => {return ({'name': `!${cmd.name}`, 'value': `${cmd.description}`})});
		reply.table(message, commands, false, 'Commands:' );
	}
};