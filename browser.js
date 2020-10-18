const puppeteer = require('puppeteer');

(async()=> {
	global.browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
	console.log(`Browser set`);
})();