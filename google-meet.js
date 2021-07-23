// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

puppeteer.use(StealthPlugin())

class GoogleMeet {
	constructor(email, pass, head, strict) {
		this.email = email;
		this.pass = pass;
		this.head = head;
		this.strict = strict;
		this.browser;
		this.page = {};
		this.browserIsActive = false;
	}

	async createBrowser() {
		this.browser = await puppeteer.launch({
			headless: this.head,
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--use-fake-ui-for-media-stream',
				'--disable-audio-output'
			],
		});
	}

	async accountLogin(newPage) {
		await newPage.goto('https://accounts.google.com/signin/v2/identifier?flowName=GlifWebSignIn&flowEntry=ServiceLogin');
		// Login Start
		await newPage.type("input#identifierId", this.email, {
			delay: 0
		})
		await newPage.click("div#identifierNext");

		await newPage.waitForTimeout(7000);

		await newPage.type("input[name=password]", this.pass, {
			delay: 0
		})
		await newPage.click("div#passwordNext");
		await newPage.waitForTimeout(5000);
	}

	async schedule(url, meetId) {
		try {
			// Open new browser only if not req
			if (!this.browserIsActive) {
				await this.createBrowser();
			}
			// open new tab on browser
			const newPage = await this.browser.newPage();

			if (!this.browserIsActive) {
				await this.accountLogin(newPage);
			}

			// open meet in tab
			await newPage.goto(url);
			console.log("inside meet page");
			await newPage.waitForTimeout(7000);
			try {
				await newPage.click("div.IYwVEf.HotEze.uB7U9e.nAZzG");
			} catch (e) {
				console.log("\naudio seems to disabled already", e.message);
			}
			await newPage.waitForTimeout(1000);
			try {
				await newPage.click("div.IYwVEf.HotEze.nAZzG");
			} catch (e) {
				console.log("\nvideo seems to be disabled already", e.message);
			}

			// sanity check (connect only if both audio and video are muted) :P
			if (this.strict) {
				let audio = await newPage.evaluate('document.querySelectorAll("div.sUZ4id")[0].children[0].getAttribute("data-is-muted")')
				let video = await newPage.evaluate('document.querySelectorAll("div.sUZ4id")[1].children[0].getAttribute("data-is-muted")')

				if (audio === "false" || video === "false") {
					console.log("Not joining meeting. We couldn't disable either audio or video from the device.\nYou may try again.")
					return
				}
				console.log("all set!!")
			}

			await newPage.waitForTimeout(1000);
			console.log('clicking on join');
			await newPage.click("span.NPEfkd.RveJvd.snByac");

			this.page[meetId] = newPage;
			this.browserIsActive = true;
			console.log("Successfully joined/Sent join request");
			return true;
		}
		catch (err) {
			console.log(err);
			this.browserIsActive = false;
			return false;
		}
	}

	async closeTab(ind) {
		await this.page[ind].close();
	}

	async closeBrowser() {
		await this.browser.close();
		this.browserIsActive = false;
	}

	getBrowserIsActive() {
		return this.browserIsActive;
	}
}

module.exports = GoogleMeet;
