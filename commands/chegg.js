const Discord = require('discord.js');
const puppeteer = require('puppeteer-extra');
const fs = require('fs');
const https = require('https');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

var queue = false;
puppeteer.use(StealthPlugin());

const download = (url, destination) => new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);

    https.get(url, response => {
        response.pipe(file);

        file.on('finish', () => {
            file.close(resolve(true));
        });
    }).on('error', error => {
        fs.unlink(destination);

        reject(error.message);
    });
});

module.exports = {
	name: 'chegg',
	description: 'Chegg Bot! Beep Boop.',
	execute(message, args) {

		var s = message.content.replace('!chegg', '');
		
		if (!s.includes('https://www.chegg.com/homework-help')) {
			const errorEmbed = new Discord.MessageEmbed()
				.setColor('#C91019')
				.setTitle('Error')
				.setURL('https://twitter.com/apekros')
				.setDescription('No no no! Chegg links only!')
				.setThumbnail('https://images-ext-1.discordapp.net/external/9yiAQ7ZAI3Rw8ai2p1uGMsaBIQ1roOA4K-ZrGbd0P_8/https/cdn1.iconfinder.com/data/icons/web-essentials-circle-style/48/delete-512.png?width=461&height=461')
				.setTimestamp()
				.setFooter('Credit @apekros', 'https://pbs.twimg.com/profile_images/1260114477137014785/wIKZacRG_400x400.jpg');
			message.channel.send(message.author.toString(), {
				embed: errorEmbed
			});
			return;
		}

		if (queue) {
			const errorEmbed = new Discord.MessageEmbed()
				.setColor('#C91019')
				.setTitle('Error')
				.setURL('https://twitter.com/apekros')
				.setDescription('Wait your turn!')
				.setThumbnail('https://images-ext-1.discordapp.net/external/9yiAQ7ZAI3Rw8ai2p1uGMsaBIQ1roOA4K-ZrGbd0P_8/https/cdn1.iconfinder.com/data/icons/web-essentials-circle-style/48/delete-512.png?width=461&height=461')
				.setTimestamp()
				.setFooter('Credit @apekros', 'https://pbs.twimg.com/profile_images/1260114477137014785/wIKZacRG_400x400.jpg');
			message.channel.send(message.author.toString(), {
				embed: errorEmbed
			});
			return;
		}
		
		process_answer(s);
		
		async function process_answer(url) {
			queue = true;
			const processEmbed = new Discord.MessageEmbed()
				.setColor('#F85B00')
				.setTitle('Processing')
				.setURL('https://twitter.com/apekros')
				.setDescription('Your request is being processed!')
				.setTimestamp()
				.setFooter('Credit @apekros', 'https://pbs.twimg.com/profile_images/1260114477137014785/wIKZacRG_400x400.jpg');
			var msg = message.channel.send(message.author.toString(), {
				embed: processEmbed
			});
			await page[0].goto(url, {
				waitUntil: 'networkidle2'
			});
			global.screenshot = await page[0].screenshot({
				path: 'test.png',
				fullPage: true
			});


			const images = await page[0].evaluate(() => Array.from(document.images, e => e.src));
			let result;
			var question = false;
			for (let i = 0; i < images.length; i++) {
				if (images[i].includes('media.cheggcdn.com')) {
					result = await download(images[i], `image-${i}.png`);

					if (result === true) {
						if (!question) {
							message.author.send("Chegg:", {
								files: [images[i]]
							})
							question = true;
						} else {
							message.author.send({
								files: [images[i]]
							})
						}
						console.log('Success:', images[i], 'has been downloaded successfully.');
					} else {
						console.log('Error:', images[i], 'was not downloaded.');
						console.error(result);
					}
				}
			}

			const element = await page[0].$('.question-body-text');
			element_property = await element.getProperty('innerHTML');
			const inner_html = await element_property.jsonValue();

			const element2 = await page[0].$('.answer-body');
			element_property2 = await element2.getProperty('innerHTML');
			const inner_html2 = await element_property2.jsonValue();

			await fs.writeFile("answer.html", inner_html.concat('\n', inner_html2), function(err) {
				if (err) return console.log(err);

			});
			message.author.send("HTML:", {
				files: ['./answer.html']
			})

			const successEmbed = new Discord.MessageEmbed()
				.setColor('#00F800')
				.setTitle('Success')
				.setURL('https://twitter.com/apekros')
				.setDescription('Your request has been processed, check your DMs!')
				.setThumbnail('https://images-ext-2.discordapp.net/external/OVUlwF6n8j6wANCkwDzG_Rb2ivqCd9bRF10DC2Z8lS0/https/s5.gifyu.com/images/ezgif.com-optimized7ce94c5d4a783cb.gif')
				.setTimestamp()
				.setFooter('Credit @apekros', 'https://pbs.twimg.com/profile_images/1260114477137014785/wIKZacRG_400x400.jpg');
			message.channel.send(message.author.toString(), {
				embed: successEmbed
			});

			queue = false;
		}
	}
};

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
