const puppeteer = require('puppeteer')
const fs = require('fs')

const loadCookies = async (page) => {
    if (fs.existsSync('cookies.json')) {
        console.log('Loading cookies...');
        const cookiesString = await fs.readFileSync('./cookies.json');
        const cookies = JSON.parse(cookiesString);
        await page.setCookie(...cookies);
        console.log('Cookies loaded');
        console.log('Reloading page');
        await page.reload()
    } else {
        console.log('Cookies not found');
        
    }
}


(async () => {
    console.log('=============STARTING=============');
    console.log('=============STARTING=============')
    console.log('=============STARTING=============')
    const browser = await puppeteer.launch({
        headless: false,
      });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768});
    console.log('Opening tiktok.com...');
    await page.goto('https://www.tiktok.com/');
    await page.setDefaultTimeout(200000)
    await loadCookies(page)
    await page.screenshot({ path: 'screenshots/page.png' });
    await page.click('.tiktok-1inll25-DivMainNavContainer > div:nth-child(2) > a:nth-child(1)')
    await page.waitForSelector('div.tiktok-1p48f7x-DivItemContainer:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) ')
    await page.click('div.tiktok-1p48f7x-DivItemContainer:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) ')
    await page.waitForSelector('.tiktok-6hn0mp-SpanOtherInfos > span:nth-child(2)')
    const element = await page.$(".tiktok-6hn0mp-SpanOtherInfos > span:nth-child(2)");
    const text = await page.evaluate(element => element.textContent, element);
    console.log(text);
    setTimeout( async () => {await browser.close()},200000)
})();