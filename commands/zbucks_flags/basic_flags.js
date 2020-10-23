const reply = require('../reply');
const database = require('../../database');

module.exports = {
	name: 'claim',
	description: 'Claim 100 Z-Bucks Every 24h',
	claimAmount: 100,
	execute(message, args, parent) {
		const claimAmount = module.exports.claimAmount;
		const utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
		database.find('zbucks', {"id": message.author.id, "server_id": message.guild.id}).then(account => {
			if(!account) account = parent.newAccount(message);
			if(account.claimDate != utc){
				database.addOrUpdate('zbucks', {"id": account.id, "server_id": account.server_id}, 
					{$set:{"zbucks": ((account.zbucks||0)+claimAmount), "claimDate": utc, "username": account.username}})
					.then(result => {
						if(result) reply.success(message, `${claimAmount} Z-Bucks Added to ${account.username}'s Account`, null);
					})
					.catch(error => {
						console.log(error);
						reply.error(message, `Failed to Add ${claimAmount} Z-Bucks`, null);
					});
			}
			else reply.to(message, `Daily Z-Bucks already claimed for ${account.username}`);
		})
		.catch(error => {
			console.log(error);
			reply.error(message, `Failed to find z-bucks for ${message.author}. Database Fetch Error.`, null);
		});
	}
};