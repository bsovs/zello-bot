const puppeteer = require('puppeteer');

(async()=> {
	global.browser = await puppeteer.launch({ headless: true });
	console.log(`Browser set`);
})();