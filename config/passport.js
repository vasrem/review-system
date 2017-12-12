var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var mongodb = require('../lib/mongodb-controller')
var bcrypt = require('bcrypt')

passport.serializeUser(function(user, done) {
	var result = {
		"username": user.username,
	}
	done(null, result);
})

passport.deserializeUser(function(obj, done) {
	mongodb.findUser(obj).then(function(user) {
		done(null, user)
	})
})

passport.use('local', new LocalStrategy({
		usernameField: 'inputUsername',
		passwordField: 'inputPassword'
	},
	function(username, password, done) {
		// Check if username exists
		// Check if password hash matches db password				
		var query = {
			"username": username
		}
		var localUser = {}
		mongodb.findUser(query).then(function(user) {
			if (!user) {
				return done(null, false, {
					message: "User not found."
				})
			}
			if (!user.active) {
				return done(null, false, {
					message: "User account not activated."
				})
			}
			localUser = user
			bcrypt.compare(password, localUser.password, function(err, res) {
				if (res) {
					return done(null, localUser)
				} else {
					return done(null, false, {
						message: "Incorrect password."
					})
				}
			})
		})
	}
))

module.exports = passport
