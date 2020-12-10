const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const { randomBytes } = require('crypto');
const GoogleMeet = require('./google-meet');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Values
let email = "201851015@iiitvadodara.ac.in";
let password = "";
let head = true;
let strict = true;

obj = new GoogleMeet(email, password, head, strict);

// cache store
// can be moved to db
let url = {};
let ind = 0;
let attendance_message = {};
let goodbye_message = {};

app.get('/', (req, res) => {
    res.render('index', { url, email, password })
});
app.post('/postlink', (req, res) => {
    ind++;
    url[ind] = {};
    url[ind].url = req.body.url;
    url[ind].attendance_message = req.body.attendance_message;
    url[ind].goodbye_message = req.body.goodbye_message;
    url[ind].startTime = Date.parse(req.body.startDate);
    url[ind].endTime = Date.parse(req.body.endDate);
    res.redirect("/");
});

const listener = app.listen(3000 || process.env.PORT, () => {

    setInterval(() => {
        // console.log(url)
        for (x in url) {
            if (url[x].startTime < Date.now()) {
                console.log(`Request for joining meet ${url[x].url}`);
                obj.schedule(url[x].url, url[x].attendance_message);
                url[x].startTime = url[x].endTime + 2000;
            }
            if (url[x].endTime < Date.now()) {
                console.log(`Request for leaving meet ${url[x].url}`);
                obj.end(url[x].goodbye_message);
                delete url[x]
            }
        }
    }, 1000)

    console.log(`App listening on port ${listener.address().port}`)
})
