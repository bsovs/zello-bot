const Discord = require("discord.js");
const PORT = process.env.PORT || 8080, isLocal=(PORT===8080);
const express = require('express'), path = require('path'), health = require('express-ping');;
const app = express(), http = require('http').Server(app);
const fs = require('fs');
const {browser} = require('./browser');

const config = isLocal ? require("./ignore/config.json") : null;

global.URL = isLocal ? `http://localhost:${PORT}` : 'https://zellobot.herokuapp.com';

// Express Server
http.listen(PORT, function(){
	console.info('\x1b[32m','Listening on:', PORT);
});

app.use(health.ping());
app.use(
	express.static(path.join(__dirname, 'public'))
);

// Discord Bot

const client = new Discord.Client();

const prefix = "!";

//setup bot commands
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

client.on("message", function(message) {
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
		message.reply('there was an error trying to execute that command!');
	}
});
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

//Start bot
client.login(isLocal ? config.BOT_TOKEN_DEV : process.env.BOT_TOKEN);

/*
//Chegg Bot Setup
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const userAgent = require('user-agents');

puppeteer.use(StealthPlugin());

global.username = config.chegg.username;
global.password = config.chegg.passwod;

client.on('ready', () => {
    login_chegg()
    console.log(`Logged in as ${client.user.tag}!`);
});
async function login_chegg() {

    global.browser = await puppeteer.launch({
        headless: false,
		executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/Chrome',
		devtools: true,
        slowMo: 250,
        userDataDir: 'C:/userData'
    });

    global.page = await browser.pages();
	
	//Random User Agent
    await page[0].setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');//userAgent.toString());
	
	//Randomize viewport size
	await page[0].setViewport({
		width: 1920 + Math.floor(Math.random() * 100),
		height: 3000 + Math.floor(Math.random() * 100),
		deviceScaleFactor: 1,
		hasTouch: false,
		isLandscape: false,
		isMobile: false,
	});
	await page[0].setJavaScriptEnabled(true);
	await page[0].setDefaultNavigationTimeout(0);
	await page[0].setRequestInterception(false);
	
	
	//GoTo Chegg
    console.log("Going to Chegg");
    await page[0].goto("https://www.chegg.com/auth?action=login&redirect=https%3A%2F%2Fwww.chegg.com%2F", {
        waitUntil: 'networkidle2'
    });

    console.log("Logging in");
    await page[0].type('#emailForSignIn', username, {
        delay: 100
    });
    await page[0].type('#passwordForSignIn', password, {
        delay: 100
    });
    await page[0].click('#eggshell-8 > form > div > div > div > footer > button'); // Types slower, like a user
    console.log("Ready!");
};
*/