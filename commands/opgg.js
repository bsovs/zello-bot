const fs = require('fs');
const {hasError, tryTo} = require('./validation');
const reply = require('./reply');
const puppeteer = require('puppeteer');
const browser = require('../browser');
const doc_path = './docs/temp';

let getUrl = (username) => {return `https://na.op.gg/summoner/userName=${username}`};

let getImage = async(username_url, id, element_name, num) => {
	const page = await global.browser.newPage();
	await page.goto(username_url, { waitUntil: "networkidle0", timeout: 60000 });
	//await page.setViewport({ width: 1024, height: 800 });
	await page.waitForSelector(element_name!=null ? element_name : '.GameListContainer');          // wait for the selector to load
	let elements = await page.$$(element_name!=null ? element_name : '.GameListContainer'); 
	num = (num==null ? 1 : num);
	for (let i = 0; i < num; i++) {
		try {
			// get screenshot of a particular element
			await elements[i].screenshot({
				path: `${doc_path}/screenshot${id}_${i}.png`,
				type: "png"
			});
		} catch(e) {
			// if element is 'not visible', spit out error and continue
			console.log(`couldnt take screenshot of element with index: ${i}. cause: `,  e)
	  }
	}
	await page.close();
	
	let retun_urls = [];
	for (let i = 0; i < num; i++) {
		retun_urls.push(`${doc_path}/screenshot${id}_${i}.png`);
	}
	return retun_urls;
};

let refresh = async(username_url) => {
	const page = await global.browser.newPage();
	await page.goto(username_url, { waitUntil: "networkidle0", timeout: 60000 });
	await page.waitForSelector('[id="SummonerRefreshButton"]');          // wait for the selector to load
	let button = await page.$('[id="SummonerRefreshButton"]');
	await button.click();
	await page.close();

	return true;
};

module.exports = {
	name: 'opgg',
	description: 'Get the op.gg URL of the tagged user(s)',
	async execute(message, args) {
		const isSetCmd = new RegExp("^-*(set)$");
		const isLastCmd = new RegExp("^-*[0-9]$");
		const isRefreshCmd = new RegExp("^-*(refresh)$");
		const OPGG_JSON = 'docs/opgg.json';
		
		var parseJson = {};
		fs.readFile(OPGG_JSON, async(error, content) => {
			if(!hasError(error)){
				parseJson = tryTo(() => JSON.parse(content));
			}
			
			let opggList = [];
			
			console.log(parseJson);
			
			if(args.length >= 2 && isSetCmd.test(args[0])){
				parseJson[message.author.id] = {"username": args[1]};
				fs.writeFile(OPGG_JSON, JSON.stringify(parseJson), (error) => {
					if(!hasError(error)) reply.success(message, `Your OP.GG has been set to ${unescape(args[1])}`, null, getUrl(args[1]));
				});
			}
			else if (isRefreshCmd.test(args[0])){
				if(parseJson[message.author.id]){
					let username_url = getUrl(parseJson[message.author.id].username);
					await refresh(username_url);
					reply.success(message, `Your OP.GG has been refreshed`, null, username_url);
				}
				else{
					reply.error(message, `${message.author.username} does not have a username set for OP.GG`);
				}
			}
			else {
				if (!!message.mentions.users.size) {
					await Promise.all(message.mentions.users.map(async(user) => {
						if(parseJson[user.id]){
							let username_url = getUrl(parseJson[user.id].username);
							let resultValue = {text: null, image: null};
							resultValue.id = parseJson[user.id].username;
							resultValue.text = `${user.username}'s OP.GG: ` + username_url;
							resultValue.image = await getImage(username_url, resultValue.id);
							opggList.push(resultValue);
						}
						else{
							opggList.push(`${user.username} does not have a username set for OP.GG`);
						}
					}));
				}
				else {
					if(!args.length || (args.length===1 && isLastCmd.test(args[0]))){
						if(parseJson[message.author.id]){
							let username_url = getUrl(parseJson[message.author.id].username);
							if (args.length===1 && isLastCmd.test(args[0])){
								reply.image(message, false, null, null, await getImage(username_url, parseJson[message.author.id].username, '.GameItemWrap', args[0].replace(new RegExp("^-*"),'')))
							}
							else{
								let resultValue = {text: null, image: null};
								resultValue.id = parseJson[message.author.id].username;
								resultValue.text = `${message.author.username}'s OP.GG: ${username_url}`;
								resultValue.image = await getImage(username_url, resultValue.id);
								opggList.push(resultValue);
							}
						}
						else{
							opggList.push({text: `${message.author.username} does not have a username set for OP.GG`, image: null});
						}
					}
					else{
						await Promise.all(args.map(async(username) => {
							let username_url = getUrl(username);
							let resultValue = {text: null, image: null};
							resultValue.id = username;
							resultValue.text = username_url;
							resultValue.image = await getImage(username_url, resultValue.id);
							opggList.push(resultValue);
						}));
					}
				}
				console.log(opggList);
				opggList.map(opgg => reply.image(message, true, opgg.text, null, opgg.image));
			} 
		});
	}
};