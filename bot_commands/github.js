const reply = require('../commands/reply');
const fs = require('fs');
const database = require('../database');
const zbucks = require('../commands/zbucks');

const git = [{"id": "295320498806718464", "name": "sovranb"}];

module.exports = {
	name: 'GitHub',
	description: 'GitHub Bot Commands',
	async execute(message) {
		const embed = message.embeds[0];
		if(!embed.title || embed.title.substring(embed.title.indexOf("["), embed.title.indexOf("]")+1) !== '[zello-bot:master]') return;
		
		database.find('git', {"username": embed.author.name, "server_id": message.guild.id}).then(user => {
			if(user && user.id){
				const members = message.channel.guild.members.cache;
				const member = members.find(m => m.id === user.id);
				if(member){
					reply.basic(message, `${member} Received Action from GitHub: ${embed.description}`);
					zbucks.add(message, user, 1000);
				}else{
					reply.basic(message, `Error getting Discord profile for: ${embed.author.name}`);
				}
			}else{
				reply.basic(message, `Please link a Discord profile to ${embed.author.name} using \`\`\`!git -set\`\`\``);
			}
		})
		.catch(error => console.log(error));
	}
};