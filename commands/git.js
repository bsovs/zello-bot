const fs = require('fs');
const reply = require('./reply');
const database = require('../database');
const doc_path = './docs/temp';

module.exports = {
	name: 'git',
	description: 'Git Commands in Discord',
	async execute(message, args) {
		const isSetCmd = new RegExp("^-*(set)$");
		
		if(args.length >= 2 && isSetCmd.test(args[0])){
			database.add('git', {"id": message.author.id}, {"id": message.author.id, "username": args[1]}).then(result => {
				reply.success(message, `Your GitHub name has been set to ${args[1]}`, null);
			})
			.catch(error => {
				console.log(error);
				reply.error(message, `Failed to Update GitHub name to to ${args[1]}`, null);
			});
		}
	}
};