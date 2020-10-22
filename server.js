const Discord = require("discord.js");
const fs = require('fs');
const PORT = process.env.PORT || 8080, isLocal=(PORT===8080);
const express = require('express'), path = require('path'), health = require('express-ping');;
const app = express(), http = require('http').Server(app);
const io = require('socket.io')(http), socket = require('./socket.io/socket');

const config = isLocal ? require("./ignore/config.json") : null;

global.URL = isLocal ? `http://localhost:${PORT}` : 'https://zellobot.herokuapp.com';
global.isLocal = isLocal;

//** Express Server **//
http.listen(PORT, function(){
	console.info('\x1b[32m','Listening on:', PORT);
});

app.use(health.ping());
app.use(
	express.static(path.join(__dirname, 'build'))
);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

//** Socket.io **//
socket.open(io);

//** Discord Bot **//
const client = new Discord.Client();

const prefix = "!";

//setup commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
let commandList = [];
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	if(command.name){
		client.commands.set(command.name, command);
		if(!command.excluded) commandList.push({'name': command.name, 'description': command.description});
	}
}
//bot commands
client.botCommands = new Discord.Collection();
const botCommandFiles = fs.readdirSync('./bot_commands').filter(file => file.endsWith('.js'));
let botCommandList = [];
for (const file of botCommandFiles) {
	const command = require(`./bot_commands/${file}`);
	if(command.name){
		client.botCommands.set(command.name, command);
		botCommandList.push({'name': command.name, 'description': command.description});
	}
}

//on message do
client.on("message", function(message) {
	if (message.webhookID) message.fetchWebhook().then(res => {
		try{client.botCommands.get(message.author.username).execute(message)}catch{}
	});
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

	const commandBody = message.content.slice(prefix.length);
	const args = commandBody.split(' ');
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;
	try {
		if(command === 'help'){
			client.commands.get(command).execute(message, commandList);
		}
		else{
			client.commands.get(command).execute(message, args);
		}
	} catch (error) {
		console.error(error);
		errorMsg = error ? `Error: ${error}`: '';
		message.reply(`there was an error trying to execute that command! \n ${errorMsg}`);
	}
});
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

//Start bot
client.login(isLocal ? config.BOT_TOKEN_DEV : process.env.BOT_TOKEN);
