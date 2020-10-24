const Discord = require("discord.js");
const fs = require('fs');
const PORT = process.env.PORT || 8080, isLocal=(PORT===8080);
const express = require('express'), path = require('path'), health = require('express-ping'), request = require('request');
const app = express(), http = require('http').Server(app);
const io = require('socket.io')(http), socket = require('./socket.io/socket');
const cookieParser = require('cookie-parser');

const config = isLocal ? require("./ignore/config.json") : null;
const API_URL = 'https';
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || config.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || config.GITHUB_CLIENT_SECRET;

global.URL = isLocal ? `http://localhost:${PORT}` : 'https://zellobot.herokuapp.com';
global.isLocal = isLocal;

//** Express Server **//
http.listen(PORT, function(){
	console.info('\x1b[32m','Listening on:', PORT);
});

errorMessage = (msg) => { return JSON.stringify({"error": `${msg}`}) };

app.use(cookieParser());
app.use(health.ping());
app.use(
	express.static(path.join(__dirname, 'build'))
);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
});
app.post('/githubLogin', (req, res, next) => {
	const code = req.body.code;
	console.log('login', code);
	
	const options = {
		url: `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`,
		timeout: 15000,
		method: 'POST'
	};
	request(options, function(err, _res, body) {
		//res.send(body);
	});
});
app.get('/githubCallback', (req, res, next) => {
	const code = req.query.code;
	const access_token = req.query.access_token;
	console.log('callback', code, access_token);
	
	if(!!code){
		res.cookie('github_code_set', true, {});
		/*res.cookie('github_code', code, {
			httpOnly: true
		});*/
		const options = {
			url: `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`,
			timeout: 15000,
			method: 'POST'
		};
		request(options, function(err, _res, body) {
			if(body){
				let values = body.split('&');
				let access_token = values[0].split('=');
				console.log(access_token[1]);
				res.cookie('github_access_token', access_token[1], {
					httpOnly: true
				});
				res.redirect('/');
			}
		});
	}/*
	else if(access_token){
		res.cookie('github_access_token', access_token, {
			httpOnly: true
		});
		res.redirect('/');
	}*/
});
app.post('/gitcommit', (req, res, next) => {
	const oauth = req.cookies.github_access_token;
	const options = {
		url: `https://api.github.com/repos/bsovs/zello-bot/git/ref/heads/master`,
		timeout: 15000,
		method: 'GET',
		headers: {
			'Authorization': `token ${oauth}`,
			'user-agent': 'node.js'
		}
	};
	request(options, function(err, _res, body) {
		if(body) createBlob(req, res, next);
		else next(errorMessage(err));
	});
});

const createBlob = (req, res, next) => {
	const oauth = req.cookies.github_access_token;
	const options = {
		url: `https://api.github.com/v2/repos/bsovs/zello-bot/git/blobs`,
		timeout: 15000,
		method: 'POST',
		headers: {
			"Authorization": `token ${oauth}`,
			"user-agent": "node.js"
		},
		json: {
			"content": `${toBase64("./docs/opgg.json")}`,
			"encoding": "base64"
		}
	};
	request(options, function(err, _res, body) {
		if(body) {console.log(_res); res.send(body);}
		else next(errorMessage(err));
	});
}
const toBase64 = file => fs.readFileSync(file, {encoding: 'base64'});

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
