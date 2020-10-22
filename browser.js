const puppeteer = require('puppeteer');

module.exports = {
	async openBrowser(){
		browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
		console.log(`Browser set`);
		return browser;
	},
	async getImage(username_url, id, element_name, num){
		const browser = await module.exports.openBrowser();
		const page = await browser.newPage();
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
		await browser.close();
		
		let retun_urls = [];
		for (let i = 0; i < num; i++) {
			retun_urls.push(`${doc_path}/screenshot${id}_${i}.png`);
		}
		return retun_urls;
	},
	async refresh(username_url){
		const browser = await module.exports.openBrowser();
		const page = await browser.newPage();
		await page.goto(username_url, { waitUntil: "networkidle0", timeout: 60000 });
		await page.waitForSelector('[id="SummonerRefreshButton"]');          // wait for the selector to load
		let button = await page.$('[id="SummonerRefreshButton"]');
		await button.click();
		await page.close();
		await browser.close();

		return true;
	}
};
