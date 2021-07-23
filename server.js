require('dotenv').config()
const express = require('express');
const path = require('path');
const GoogleMeet = require('./google-meet');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Values
let email = process.env.EMAIL;
let password = process.env.PASSWORD;

let head = false;
let strict = false;

meetObj = new GoogleMeet(email, password, head, strict);

// cache store
// can be moved to db
let url = {};
let ind = 0;

app.get('/', (req, res) => {
	res.render('index', { url, email, password })
});
app.post('/postlink', (req, res) => {
	ind++;
	url[ind] = {};
	url[ind].id = ind;
	url[ind].url = req.body.url;
	url[ind].startTime = Date.parse(req.body.startDate);
	url[ind].endTime = Date.parse(req.body.endDate);
	res.redirect("/");
});

const listener = app.listen(3000 || process.env.PORT, () => {

	setInterval(() => {
		// when no scheduled links
		if (Object.keys(url).length === 0) {
			if (meetObj.getBrowserIsActive())
				meetObj.closeBrowser();
			else
				return;
		}
		// check meet array every 10sec
		for (x in url) {
			// join period
			if (url[x].startTime < Date.now() && url[x].endTime > Date.now()) {
				console.log(`Request for joining meet ${url[x].url}`);
				meetObj.schedule(url[x].url, url[x].id);
				// hack: set above endTime so that it will not come for 
				// 				same meetId in this block
				url[x].startTime = url[x].endTime + 2000; 
			}
			// leave period
			if (url[x].endTime < Date.now()) {
				console.log(`Request for leaving meet ${url[x].url}`);
				meetObj.closeTab(url[x].id);
				delete url[x];
			}
		}
	}, 10000)

	console.log(`App listening on port ${listener.address().port}`)
})