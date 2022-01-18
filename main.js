const puppeteer = require('puppeteer')
const fs = require('fs')
const { syncBuiltinESMExports } = require('module')
const axios = require('axios')

let count = 0
const emoji = [
  '✌',
  '😂',
  '😝',
  '😁',
  '😱',
  '👉',
  '🙌',
  '🍻',
  '🔥',
  '🌈',
  '☀',
  '🎈',
  '🌹',
  '💄',
  '🎀',
  '⚽',
  '🎾',
  '🏁',
  '😡',
  '👿',
  '🐻',
  '🐶',
  '🐬',
  '🐟',
  '🍀',
  '👀',
  '🚗',
  '🍎',
  '💝',
  '💙',
  '👌',
  '❤',
  '😍',
  '😉',
  '😓',
  '😳',
  '💪',
  '💩',
  '🍸',
  '🔑',
  '💖',
  '🌟',
  '🎉',
  '🌺',
  '🎶',
  '👠',
  '🏈',
  '⚾',
  '🏆',
  '👽',
  '💀',
  '🐵',
  '🐮',
  '🐩',
  '🐎',
  '💣',
  '👃',
  '👂',
  '🍓',
  '💘',
  '💜',
  '👊',
  '💋',
  '😘',
  '😜',
  '😵',
  '🙏',
  '👋',
  '🚽',
  '💃',
  '💎',
  '🚀',
  '🌙',
  '🎁',
  '⛄',
  '🌊',
  '⛵',
  '🏀',
  '🎱',
  '💰',
  '👶',
  '👸',
  '🐰',
  '🐷',
  '🐍',
  '🐫',
  '🔫',
  '👄',
  '🚲',
  '🍉',
  '💛',
  '💚',
]
const commentOrigin = [
  'Hello, tell me, am i beautiful?',
  'Hi, tell me, am i hot?',
  'Hello, tell me, am i pretty?',
  'Hi, tell me, am i pretty?',
  'Hi, rate me pls.',
  "Are you boy's here?",
  "You think I'm the hottest?",
  'Hello, am I very beautiful?',
  'Hello, am I very hot?',
  'Hi, am I very hot?',
  'Hello, am I hot?',
  'Hi, am I hot?',
  'Hello, do boys like me?',
  'Hi, do boys like me?',
  'Hello, do boys like me?',
  'Hey boys do you like me?',
  'Hi boys do you like me?',
]

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

const randomEmoji = async () => {
  let result = ''
  let i = Math.floor(Math.random() * 3)
  while (i < 4) {
    result += emoji[Math.floor(Math.random() * emoji.length)]
    i += 1
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

  await page.click('div.swiper-slide-active button.tiktok-1n0l0dy-ButtonActionItem:nth-child(3)')

  await page.waitForSelector('.DraftEditor-root', { clickable: true })
  await page.click('.DraftEditor-root')
  await page.keyboard.type(
    (await randomEmoji()) +
      commentOrigin[Math.floor(Math.random() * commentOrigin.length)] +
      (await randomEmoji()),
    { delay: 100 }
  )

  await page.waitForSelector('.tiktok-1w3780e-DivPostButton', { clickable: true })
  await page.click('.tiktok-1w3780e-DivPostButton')
  sleep(3000)

  await page.waitForSelector('div.css-feuqz4-notice-content')
  await page.waitForSelector(
    'div.tiktok-16r0vzi-DivCommentItemContainer:first-child  div[data-e2e="comment-like-icon"]',
    { clickable: true }
  )
  await page.click(
    'div.tiktok-16r0vzi-DivCommentItemContainer:first-child  div[data-e2e="comment-like-icon"]'
  )

  sleep(1000)
  count = count + 1
  await axios(
    `https://api.telegram.org/bot1952032508:AAHIPleEbNEpXBt6eIpdYxqPKeCvBkRqQqg/sendMessage?chat_id=395686421&text= Video url ->` +
      (await page.url()) +
      `\n\n ---tiktok script---`
  )
  console.log(`---COMMENTS COUNT - ${count} ---`)
}

;(async () => {
  console.log('=============STARTING=============')
  console.log('=============STARTING=============')
  console.log('=============STARTING=============')

  // init puppeteer
  const browser = await puppeteer.launch({
    headless: false,
  })

  // load new tab and open tiktok.com
  const page = await browser.newPage()
  await page.setDefaultTimeout(200000)
  await page.setViewport({ width: 1366, height: 768 })
  console.log('Opening tiktok.com...')
  await page.goto('https://www.tiktok.com/')

  // load cookies and save screenshot
  // await loadCookies(page)
  await page.screenshot({ path: 'screenshots/page.png' })
  console.log('Opening following page')

  // open following page
  // await page.click('.tiktok-1inll25-DivMainNavContainer > div:nth-child(2) > a:nth-child(1)')
  await page.waitForSelector('div.swiper-slide-active strong[data-e2e="comment-count"]')

  // main cycle
  while (count < 120) {
    sleep(3000)
    await page.waitForSelector('div.swiper-slide-active strong[data-e2e="comment-count"]')
    const element = await page.$('div.swiper-slide-active strong[data-e2e="comment-count"]')
    const text = await page.evaluate((element) => element.textContent, element)
    console.log(text)
    if (
      text.indexOf('m') !== -1 &&
      text.indexOf('k') !== -1 &&
      text.indexOf('K') !== -1 &&
      text.indexOf('M') !== -1
    ) {
    } else {
      if (text < 88) {
        await comment(page)
      }
    }

    await page.waitForSelector('div.swiper-slide-active button[data-e2e="arrow-right"]', {
      visible: true,
    })
    await page.click('.div.swiper-slide-active button[data-e2e="arrow-right"]')
  }

  // setTimeout( async () => {await browser.close()},200000)
})()
