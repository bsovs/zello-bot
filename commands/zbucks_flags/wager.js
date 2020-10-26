const reply = require('../reply');

module.exports = {
	name: 'wager',
	description: 'Link to Zello Betting Service',
	url: "https://zellobot.herokuapp.com/lol-bets",
	execute(message, args, parent) {
		reply.basic(message, module.exports.url);
	}
};