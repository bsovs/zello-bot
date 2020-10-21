const Discord = require("discord.js");

const successGif = 'https://images-ext-2.discordapp.net/external/OVUlwF6n8j6wANCkwDzG_Rb2ivqCd9bRF10DC2Z8lS0/https/s5.gifyu.com/images/ezgif.com-optimized7ce94c5d4a783cb.gif';
const errorGif = 'https://images-ext-1.discordapp.net/external/9yiAQ7ZAI3Rw8ai2p1uGMsaBIQ1roOA4K-ZrGbd0P_8/https/cdn1.iconfinder.com/data/icons/web-essentials-circle-style/48/delete-512.png?width=461&height=461';
const avatar_url = 'https://cdn.discordapp.com/avatars/295320498806718464/07ccf87c408c6f5279939e70c3af314e.webp';
const zello_url = '';

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
			.setFooter('Credit @barndorn', avatar_url);
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
			.setFooter('Credit @barndorn', avatar_url);
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
				.setFooter('Credit @barndorn', avatar_url)
			: '';
		let val = {};
			if(hasCard) val.embed = successEmbed;
			val.files = (Array.isArray(thumbnail) ? thumbnail : [thumbnail]);
		message.channel.send(message.author.toString(), val);
	},
	table(message, list, isInline, header, description, thumbnail, url, color){
		const getFields = (list) => {
			if(typeof list !== 'object' || list == null) return list;
			return list.map(item => {return ({ 'name': item.name, 'value': item.value, 'inline': isInline })})
		};
		const tableEmbed = new Discord.MessageEmbed()
			.setColor(color)
			.setURL(url!=null ? url : '')
			.setTitle(header)
			.setDescription(description!=null ? description : '')
			.setThumbnail(thumbnail!=null ? thumbnail : '')
			.addFields(getFields(list))
			.setTimestamp()
			.setFooter('Credit @barndorn', avatar_url);
		message.channel.send({
			embed: tableEmbed,
		});
	},
	bank(message, description, thumbnail, accounts, isToUser){
		const getFields = (list) => {
			if(typeof list !== 'object' || list == null) return list;
			return list.map(item => {return ({ 'name': item.name, 'value': item.value, 'inline': true })})
		};
		const bankEmbed = new Discord.MessageEmbed()
			.setColor('#FFD700')
			.setURL('')
			.setTitle('Zello Bank')
			.setDescription(description!=null ? description : '')
			.setThumbnail(thumbnail!=null ? thumbnail : '')
			.addFields(getFields(accounts))
			.setTimestamp()
			.setFooter('Bank of Zello ©');
		message.channel.send(
			isToUser ? message.author : '',
			{
				embed: bankEmbed,
			}
		);
	},
	basic(message, description){
		message.channel.send(description);
	},
	to(message, user, description){
		message.channel.send(user, description);
	},
	editLink(message){
		message.channel.send(message.author.toString() + ' Gyazo is Deprecated, Please use ⌘+⇧+S', {files: [message.embeds[0].thumbnail.url]});
	}
};