var routes = require('./lib/routes.js')
var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')
var passport = require('./config/passport')
var flash = require('connect-flash')

const app = express()

app.use(bodyParser.urlencoded({
	extended: true
}));
app.set('views', './views')
app.set('view engine', 'pug')
app.use(session({
	secret: 'review sys',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		maxAge: 2419200000
	}
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use('/', routes)
app.use(express.static(__dirname + '/public'));

app.listen(3000, () => {
	console.log('Express server started on port 3000')
});

module.exports = app
