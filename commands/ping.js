module.exports = {
	name: 'ping',
	description: 'Check Bot ping!',
	execute(message) {
		const timeTaken = Date.now() - message.createdTimestamp;
		message.channel.send(`Pong! This message had a latency of ${timeTaken}ms.`);
	}
};