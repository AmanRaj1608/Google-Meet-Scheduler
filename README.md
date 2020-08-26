<p align="center"><img src="https://cdn.shopify.com/s/files/1/2579/7072/articles/puppeteer-cover_1200x630.png?v=1521812467" align="center" width="250"></p>
<h2 align="center">Google Meet Scheduler</h2>
<p align="center"><b>Join's meet link for you 😴</b></p>

### Bot for scheduling and entering google meet sessions automatically.

### Installation Guide
1. Open terminal on your PC
2. Clone the repo `git clone https://github.com/AmanRaj1608/Google-Meet-Scheduler.git`
3. Go inside the project directory
4. Go to `server.js` file and on `line 14 and 15` and add your email and password there
5. Install dependencies `npm install`
6. Start the application `npm start`

Now the project has started on `localhost:3000`

### Usage Guide
Now when you visit the page you will see things to add 
- Meet Link
- Start Time
- End time 

Then submit and do what you wanted to, it will log in and join meet for you. 

You can add more links there to add it to the queue.


### Requirements
- [Node.js](ttps://nodejs.org/en/download/) should be installed
- [Google Chrome](https://www.google.com/intl/en_in/chrome/) with version 70+
- Works only on windows (see [Issue #2](https://github.com/AmanRaj1608/Google-Meet-Scheduler/issues/8) for more info)

### If you want to see the whole process
On line `16` of `server.js` file you can see a variable name head=false;

If you want to see bot automatically opening the page and filling login values and joining meet link then you can set the headless as flase.

But while for deployment we need headless as true.


### Deployment

If you want to deploy your instance of app you need it to set it up properly.
The main problem on deployment is that after deployment it will be hosted on different IP and when bot tries to sign in Google will ask to login again with `one time password`. 

More details here [#1](https://github.com/AmanRaj1608/Google-Meet-Scheduler/issues/1)

The option of deployment limits for apps like Heroku and Glitch. 


#### Todo

You can however deploy it by creating an API that will ask for OTP and while sign-in you give that info to the server.
This can be implemented as a new branch especially for deployment purpose

#### How it works




---
<p align="center"> Made with ❤️ by <a href="https://github.com/amanraj1608">Aman Raj</a></p>

---
