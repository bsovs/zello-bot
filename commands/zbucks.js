const fs = require('fs');
const reply = require('./reply');
const database = require('../database');
const doc_path = './docs/temp';

module.exports = {
	name: 'zbucks',
	description: 'Find out how many z-bucks you have',
	async execute(message, args) {
		database.find('zbucks', {"id": message.author.id, "server_id": message.guild.id}).then(account => {
			let accounts = [{'name': 'Member', 'value': account.username}, {'name': 'Z-Bucks', 'value': account.zbucks}];
			if(account) reply.bank(message, `${account.username}'s account:`, null, accounts, true);
			else reply.error(message, `Failed to find z-bucks for ${message.author}`, null);
		})
		.catch(error => {
			console.log(error);
			reply.error(message, `Failed to find z-bucks for ${message.author}`, null);
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
		console.log(user);
		database.addOrUpdate('zbucks', {"id": user.id, "server_id": message.guild.id}, {$set:{"id": user.id, "server_id": message.guild.id, "username":  user.username}}).then(result => {
			if(result) reply.success(message, `Initialized ${user.username}'s Account`, null);
		})
		.catch(error => {
			console.log(error);
			reply.error(message, `Failed to Initalize Account for ${user.username}`, null);
		});
	}
};