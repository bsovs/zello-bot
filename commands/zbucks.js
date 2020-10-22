const reply = require('./reply');
const database = require('../database');
const flagService = require('./services/flagService');
const flagBody = flagService.execute('zbucks_flags');

module.exports = {
	name: 'zbucks',
	description: 'Find out how many z-bucks you have',
	execute(message, args) {
		if (!args[0]) {
			module.exports.list(message);
		}
		else{	
			try{
				flagService.checkFlags(message, args, flagBody);
			}
			catch(error){throw error}
		}
	},
	async list(message) {
		database.find('zbucks', {"id": message.author.id, "server_id": message.guild.id}).then(account => {
			if(account){
				let accounts = [{'name': 'Member', 'value': account.username}, {'name': 'Z-Bucks', 'value': (account.zbucks || 0)}];
				reply.bank(message, `${account.username}'s account:`, null, accounts, true);
			}
			else module.exports.init(message, message.author);
		})
		.catch(error => {
			console.log(error);
			reply.error(message, `Failed to find z-bucks for ${message.author}. Database Fetch Error.`, null);
		});
	},
	async add(message, user, amount) {
		database.addOrUpdate('zbucks', {"id": user.id, "server_id": message.guild.id}, {$inc:{"zbucks": amount}}).then(result => {
			if(result) reply.success(message, `${amount} Z-Bucks Added to ${user.username}'s Account`, null);
		})
		.catch(error => {
			console.log(error);
			reply.error(message, `Failed to Add ${amount} Z-Bucks`, null);
		});
	},
	async init(message, user) {
		database.addOrUpdate('zbucks', {"id": user.id, "server_id": message.guild.id}, {$set:{"id": user.id, "server_id": message.guild.id, "username":  user.username}}).then(result => {
			if(result) reply.success(message, `Initialized ${user.username}'s Account`, null);
		})
		.catch(error => {
			console.log(error);
			reply.error(message, `Failed to Initalize Account for ${user.username}`, null);
		});
	}
};