const puppeteer = require('puppeteer');
const fs = require('fs')

const loadCookies = async (page) => {
    if (fs.existsSync('cookies.json')) {
        console.log('Cookies found');
    } else {
        console.log('Cookies not found');
    }
}

const saveCookies = async (page) => {
    
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

  await browser.close();
})();