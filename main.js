const puppeteer = require('puppeteer')
const fs = require('fs')
const { syncBuiltinESMExports } = require('module')
const axios = require('axios')

let count = 0
const emoji =  ["✌","😂","😝","😁","😱","👉","🙌","🍻","🔥","🌈","☀","🎈","🌹","💄","🎀","⚽","🎾","🏁","😡","👿","🐻","🐶","🐬","🐟","🍀","👀","🚗","🍎","💝","💙","👌","❤","😍","😉","😓","😳","💪","💩","🍸","🔑","💖","🌟","🎉","🌺","🎶","👠","🏈","⚾","🏆","👽","💀","🐵","🐮","🐩","🐎","💣","👃","👂","🍓","💘","💜","👊","💋","😘","😜","😵","🙏","👋","🚽","💃","💎","🚀","🌙","🎁","⛄","🌊","⛵","🏀","🎱","💰","👶","👸","🐰","🐷","🐍","🐫","🔫","👄","🚲","🍉","💛","💚"]
const commentOrigin = ["Hello, tell me, am i beautiful?", "Hi, tell me, am i hot?", "Hello, tell me, am i pretty?", "Hi, tell me, am i pretty?", "Hi, rate me pls.", "Are you boy's here?", "You think I'm the hottest?", "Hello, am I very beautiful?", "Hello, am I very hot?", "Hi, am I very hot?", "Hello, am I hot?", "Hi, am I hot?", "Hello, do boys like me?", "Hi, do boys like me?", "Hello, do boys like me?", "Hey boys do you like me?", "Hi boys do you like me?"]

const loadCookies = async (page) => {
  if (fs.existsSync('cookies.json')) {
    console.log('Loading cookies...')
    const cookiesString = await fs.readFileSync('./cookies.json')
    const cookies = JSON.parse(cookiesString)
    await page.setCookie(...cookies)
    console.log('Cookies loaded')
    console.log('Reloading page')
    await page.reload()
  } else {
    console.log('Cookies not found')
  }
}

const randomEmoji = async  () => {
  let result = ''
  let i = Math.floor(Math.random() * 3)
  while (i < 4) {
    result += emoji[Math.floor(Math.random() * emoji.length)]
    i+=1
  }
  return result
}

const sleep = (delay) => {
  var start = new Date().getTime()
  while (new Date().getTime() < start + delay);
}

const comment = async (page) => {
  console.log('---COMMENTING---')
  sleep(3000)
  await page.waitForSelector('.DraftEditor-root')
  await page.click('.DraftEditor-root')
  await page.keyboard.type(await randomEmoji() + commentOrigin[Math.floor(Math.random() * commentOrigin.length)] + await randomEmoji(), { delay: 100 })
  sleep(500)
  await page.waitForSelector('.tiktok-1w3780e-DivPostButton', { clickable: true })
  sleep(200)
  await page.click('.tiktok-1w3780e-DivPostButton')
  await page.waitForSelector('.css-1commy4-DivMessageContainer')
  sleep(3000)
  await page.waitForSelector('div.tiktok-16r0vzi-DivCommentItemContainer:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1)')
  await page.click(
    'div.tiktok-16r0vzi-DivCommentItemContainer:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1)'
  )

  sleep(3000)
  count = count + 1
  await axios(`https://api.telegram.org/bot1952032508:AAHIPleEbNEpXBt6eIpdYxqPKeCvBkRqQqg/sendMessage?chat_id=395686421&text= Video url ->` + await page.url() + `\n\n ---tiktok script---`)
  console.log(`---COMMENTS COUNT - ${count} ---`)
}

(async () => {
  console.log('=============STARTING=============')
  console.log('=============STARTING=============')
  console.log('=============STARTING=============')
  const browser = await puppeteer.launch({
    headless: false,
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1366, height: 768 })
  console.log('Opening tiktok.com...')
  await page.goto('https://www.tiktok.com/')
  await page.setDefaultTimeout(200000)
  await loadCookies(page)
  await page.screenshot({ path: 'screenshots/page.png' })
  console.log('Opening following page')
  
  await page.click('.tiktok-1inll25-DivMainNavContainer > div:nth-child(2) > a:nth-child(1)')
  await page.waitForSelector(
    'div.tiktok-1p48f7x-DivItemContainer:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) '
  )
  await page.click(
    'div.tiktok-1p48f7x-DivItemContainer:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) '
  )

  while (count < 120) {
    sleep(3000)
    await page.waitForSelector('.tiktok-6hn0mp-SpanOtherInfos > span:nth-child(2)')
    const element = await page.$('.tiktok-6hn0mp-SpanOtherInfos > span:nth-child(2)')
    const text = await page.evaluate((element) => element.textContent, element)
    console.log(text)
    if (text.indexOf('m') !== -1 || text.indexOf('now') !== -1) {
      if (text.indexOf('m') !== -1) {
        if (text.match(/\d+/)[0] <= 45) {
          await comment(page)
        }
      } else {
        await comment(page)
      }
    }

    await page.waitForSelector('.tiktok-eeutzd-ButtonBasicButtonContainer-StyledVideoSwitchV2', {
      visible: true,
    })
    await page.click('.tiktok-eeutzd-ButtonBasicButtonContainer-StyledVideoSwitchV2')
  }

  // setTimeout( async () => {await browser.close()},200000)
})()
