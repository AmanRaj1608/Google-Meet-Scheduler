// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

puppeteer.use(StealthPlugin())

class GoogleMeet {
    constructor(email, pass) {
        this.email = email;
        this.pass = pass;
        this.browser;
    }
    async schedule(url) {
        try {
            // Open browser
            this.browser = await puppeteer.launch({
                headless: true,
                args: ['--use-fake-ui-for-media-stream', '--disable-audio-output']
            });
            let page = await this.browser.newPage()
            await page.goto('https://accounts.google.com/signin/v2/identifier?flowName=GlifWebSignIn&flowEntry=ServiceLogin')

            // Login Start
            await page.type("input#identifierId", this.email, {
                delay: 0
            })
            await page.click("div#identifierNext")

            await page.waitFor(7000)

            await page.type("input.whsOnd.zHQkBf", this.pass, {
                delay: 0
            })
            await page.click("div#passwordNext")

            await page.waitFor(5000)

            await page.goto(url)

            console.log("inside meet page")
            await page.waitFor(7000)
            await page.click("div.IYwVEf.HotEze.uB7U9e.nAZzG")
            await page.waitFor(1000)
            await page.click("div.IYwVEf.HotEze.nAZzG")
            await page.waitFor(1000)
            console.log('clicking on join')
            await page.click("span.NPEfkd.RveJvd.snByac")
            console.log("Successfully joined/Sent join request")
        }
        catch(err) {
            console.log(err)
        }
    }
}

module.exports = GoogleMeet;

