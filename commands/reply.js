const Discord = require("discord.js");

const successGif = 'https://images-ext-2.discordapp.net/external/OVUlwF6n8j6wANCkwDzG_Rb2ivqCd9bRF10DC2Z8lS0/https/s5.gifyu.com/images/ezgif.com-optimized7ce94c5d4a783cb.gif';
const errorGif = 'https://images-ext-1.discordapp.net/external/9yiAQ7ZAI3Rw8ai2p1uGMsaBIQ1roOA4K-ZrGbd0P_8/https/cdn1.iconfinder.com/data/icons/web-essentials-circle-style/48/delete-512.png?width=461&height=461';


module.exports = {
	description: 'Responses by Zello-Bot',
	success(message, description, thumbnail, url){
		const successEmbed = new Discord.MessageEmbed()
			.setColor('#00F800')
			.setTitle('Success')
			.setDescription(description)
			.setThumbnail(thumbnail!=null ? thumbnail : successGif)
			.setURL(url)
			.setTimestamp()
			.setFooter('Credit @barndorn');
		message.channel.send(message.author.toString(), {
			embed: successEmbed
		});
	},
	error(message, description, thumbnail, url){
		const successEmbed = new Discord.MessageEmbed()
			.setColor('#C91019')
			.setTitle('Error')
			.setDescription(description)
			.setThumbnail(thumbnail!=null ? thumbnail : errorGif)
			.setURL(url)
			.setTimestamp()
			.setFooter('Credit @barndorn');
		message.channel.send(message.author.toString(), {
			embed: successEmbed
		});
	},
	image(message, hasCard, title, description, thumbnail, url){
		const successEmbed = hasCard ? new Discord.MessageEmbed()
				.setColor('#5383e8')
				.setTitle(title)
				.setDescription(description!=null ? description : '')
				.setURL(url)
				.setTimestamp()
				.setFooter('Credit @barndorn')
			: null;
		message.channel.send(message.author.toString(), {
			embed: successEmbed,
			files: (thumbnail.length>=1 ? thumbnail : [thumbnail])
		});
	},
	table(message, list, isInline, header){
		const getFields = (list) => {return list.map(item => {return ({ 'name': item.name, 'value': item.value, 'inline': isInline })})};
		const tableEmbed = new Discord.MessageEmbed()
			.setTitle(header)
			.addFields(getFields(list))
			.setFooter('Credit @barndorn');
		message.channel.send({
			embed: tableEmbed,
		});
	},
	basic(message, description){
		message.channel.send(description);
	},
	to(message, user, description){
		message.channel.send(user, description);
	},
};