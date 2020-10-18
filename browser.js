const puppeteer = require('puppeteer');

(async()=> {
	global.browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
	console.log(`Browser set`);
})();