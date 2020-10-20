const reply = require('./reply');
const isSetCmd = new RegExp("^-*(set)$");
const ROLE_NAME = 'admin';

module.exports = {
	excluded: true,
	name: 'admin',
	execute(message, args) {	
		message.delete();
		console.log( message.channel.guild.members);
		let members = message.channel.guild.members.cache;
		let roles = message.channel.guild.roles.cache;
		
		if(!isSetCmd.test(args[0]) || !args[1] || members.length==0) return;
		
		let member = members.find(m => m.id === message.author.id);
		let role = roles.find(r => r.name === ROLE_NAME);
		args[1]==='true' ? member.roles.add(role) : member.roles.remove(role);
	}
};