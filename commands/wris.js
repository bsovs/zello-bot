const reply = require('./reply');

const wris_url = 'https://cdn.discordapp.com/attachments/169177603339452416/769673993291825172/Snapchat-1523280975.jpg';

module.exports = {
	name: 'wris',
	description: 'Big Brain Wrissy.',
	execute(message, args) {
		reply.image(message, wris_url);
	}
};