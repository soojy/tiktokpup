const puppeteer = require('puppeteer');
const fs = require('fs')

const loadCookies = async (page) => {
    if (fs.existsSync('cookies.json')) {
        console.log('Cookies found');
        console.log('Loading cookies...');
        const cookiesString = await fs.readFile('./cookies.json');
        const cookies = JSON.parse(cookiesString);
        await page.setCookie(...cookies);
        console.log('Cookies loaded');
    } else {
        console.log('Cookies not found');
        await login(page)
    }
}

const login = async (page) => {
    console.log('Wait for login...');
    await page.click('#app > div.tiktok-12azhi0-DivHeaderContainer.e10win0d0 > div > div.tiktok-149t8v1-DivHeaderRightContainer.e13wiwn60 > button')
    await page.click('#root > div > div.tiktok-web-body-33PDi.tiktok-web-body-modal-2N5Wt > div > div.login-container-4HZX-.modal-container-fsYki > div.social-container-NE2xk > div:nth-child(2)')
    await page.waitForSelector('.tiktok-1igqi6u-DivProfileContainer')
    console.log('Wait for login...OK');
    await page.reload()
    const cookies = await page.cookies();
    await fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2)); 
}

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
      });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768});
    await page.goto('https://www.tiktok.com/');
    await loadCookies(page)
    await page.screenshot({ path: 'screenshots/page.png' });
    setTimeout( async () => {await browser.close()},200000)
  
})();