const fs = require('fs');
const reply = require('./reply');
const puppeteer = require('puppeteer');
const browser = require('../browser');
const doc_path = './docs/temp';

const pickem_url = 'https://pickem.lolesports.com/#series/7/user/8258672/leaderboards/list/900721';

let getImage = async() => {
	const browser = await browser.openBrowser();
	const page = await browser.newPage();
	await page.goto(pickem_url, { waitUntil: "networkidle0", timeout: 60000 });
	await page.setViewport({ width: 2024, height: 800 });
	await page.waitForSelector('.leaderboards-content');
	let element = await page.$('.leaderboards-content'); 
	try {
		// get screenshot of a particular element
		await element.screenshot({
			path: `${doc_path}/screenshot_pickems.png`,
			type: "png"
		});
	} catch(e) {
		console.log(`couldnt take screenshot of element cause: `,  e)
	}
	await page.close();
	await browser.close();

	return `${doc_path}/screenshot_pickems.png`;
};

module.exports = {
	name: 'pickem',
	description: 'Get Zello World\'s Bracket',
	async execute(message, args) {
		let image = await getImage();
		reply.imageAndCard(message, true, 'Zello World\'s Bracket', null, image, pickem_url)
	}
};