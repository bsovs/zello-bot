const fs = require('fs');
const Discord = require("discord.js");
const reply = require('../reply');

module.exports = {
	excluded: true,
	name: 'flagService',
	description: 'Used to get command flags',
	prefix: '-',
	execute(moduleName) {
		//setup flag commands
		console.log(moduleName);
		let flags = new Discord.Collection();
		const flagFiles = fs.readdirSync(`./commands/${moduleName}`).filter(file => file.endsWith('.js'));
		let flagList = [];
		for (const file of flagFiles) {
			const flag = require(`../${moduleName}/${file}`);
			if(flag.name){
				flags.set(flag.name, flag);
				if(!flag.excluded) flagList.push({'name': flag.name, 'description': flag.description});
			}
		}
		return {flags, flagList};
	},
	checkFlags(message, args, flagBody, parent){
		if (!args[0].startsWith(module.exports.prefix)) throw 'invalid flag syntax. please use - infront of flags.';
		const command = args.shift().toLowerCase().slice(module.exports.prefix.length);
		
		if (!flagBody.flags.has(command) && command !== 'help') throw 'flag does not exist';
		try {
			if(command === 'help'){
				module.exports.help(message, flagBody.flagList);
			}
			else{
				args.shift();
				flagBody.flags.get(command).execute(message, args, parent);
			}
		} catch (error) {
			throw 'flag error -> ' + error;
		}
	},
	help(message, commands) {
		commands = commands.map(cmd => {return ({'name': `-${cmd.name}`, 'value': `${cmd.description}`})});
		reply.table(message, commands, false, 'Commands:' );
	}
};
