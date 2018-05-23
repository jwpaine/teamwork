const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
var cookieParser = require('cookie-parser');
var session      = require('express-session');

const app = express()

// required for passport
app.use(session({ 
	cookie: {
		path : '/',
		httpOnly : false,
		maxAge : 24*60*60*1000
	},
	secret: 'Nhs7Fg58Jjshhr67ujhbvr7hsw34rtghj' ,
	resave: true,
	saveUninitialized: true
	
	})); // session secret

app.use(cookieParser()); // read cookies (needed for auth)
app.set('port', (process.env.PORT || 8080))
// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))
// Process application/json
app.use(bodyParser.json())
// Index route
app.get('/', function (req, res) {
	res.render('index.ejs');
});
app.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    var redirect_uri  = "http://127.0.0.1:8080/auth";
	res.redirect('https://www.teamwork.com/launchpad/login?redirect_uri=' + redirect_uri); 
});
// endpoint for Teamwork app login flow (OAuth)
app.get('/auth', function(req, res) {
    // get code
     var auth_code = req.query.code;
     console.log('received code: ' + auth_code);

     console.log('sending post request to teamwork launchpad to get perm access token...');
     uri = 'https://www.teamwork.com/launchpad/v1/token.json'
     request.post(
        uri,
        { json: { code:  auth_code} },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        }
    );

});
// Spin up server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})

