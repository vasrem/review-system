var router = require('express').Router()
var mongodb = require('./mongodb-controller')
var passport = require('../config/passport')
var nodemailer = require('../config/nodemailer')
var middlewares = require('./middlewares')
var helpers = require('./helpers')
var fs = require('fs')
var path = require('path')
var cors = require('cors')
var appDir = path.dirname(require.main.filename)

router.get('/', (req, res) => {
	res.redirect('/newreview')
});
router.get('/newreview', middlewares.checkIfAuthorized, (req, res) => {
	res.render('newreview')
});

router.post('/newreview', middlewares.checkIfAuthorized, (req, res) => {
	var data = {
		name: req.body.inputName,
		email: req.body.inputEmail,
		stars: req.body.inputStar,
		service: req.body.inputService,
		review: req.body.inputReview
	}
	mongodb.insertReview(data)
	res.render('thankyou')
});

router.get('/admin', middlewares.checkIfAuthorized, middlewares.checkIfAuthorizedToAdmin, (req, res) => {
	var query = {
		page: req.query.page ? parseInt(req.query.page) : 1
	}
	mongodb.getReviewsCount().then(function(count) {
		query['maxpages'] = Math.ceil(count / 10)
		return mongodb.getReviews(query)
	}).then(function(reviews) {
		reviews.forEach(function(item, index, reviews) {
			var date = new Date(item.timestamp)
			item.timestamp = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
			reviews[index] = item
		})
		return reviews
	}).then(function(reviews) {
		res.render('admin', {
			reviews: reviews,
			data: query
		})
	})
});

router.get('/login', middlewares.redirectToPanel, (req, res) => {
	var error = req.flash().error
	var message = error ? error[0] : ""
	res.render('login', {
		message: message
	})
});

router.get('/logout', middlewares.checkIfAuthorized, function(req, res) {
	req.session.destroy()
	req.logOut()
	res.redirect('/login')
})

router.post('/auth', passport.authenticate('local', {
	successRedirect: '/newreview',
	failureRedirect: '/login',
	failureFlash: true
}), function(req, res) {});

router.get('/register', middlewares.redirectToPanel, (req, res) => {
	res.render('register', {
		messages: []
	})
});

router.post('/register', middlewares.redirectToPanel, function(req, res) {
	var user = {
		username: req.body.inputUsername,
		password: req.body.inputPassword,
	}
	mongodb.insertUser(user).then(function(user) {
		res.render('register', {
			messages: ["Registration Done"]
		})
	})

})

router.post('/getallreviews', cors(), (req, res) => {
	var data = {
		site: req.body.service
	}
	mongodb.getAllReviews(data).then(function(result){
		reviews = []
		result.forEach(function(item){
			let date = new Date(item.timestamp)
			item.timestamp = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
			let o = {
				name: item.name,
				stars: item.stars,
				review: item.review,
			    date: item.timestamp 
			}
			reviews.push(o)
		})
		res.json(reviews)
	})
});

router.post('/sendmail', middlewares.checkIfAuthorized, middlewares.checkIfAuthorizedToAdmin, (req, res) => {
	var data = {
		id: parseInt(req.body.reviewId)
	}
	var _review
	mongodb.getReviewByID(data).then(function(review) {
		_review = review
		return helpers.fillEmail(review)
	}).then(function(email) {
		var options = {
			from: 'Bluerent a car <feedback@carrentalthessaloniki.com>',
			to: _review.email,
			subject: 'Thank you!',
			html: email
		}
		nodemailer.sendMail(options, (err, info) => {
			if (err) {
				console.log(err);
				return 500
			}
			return 200
		})
	}).then(function(status) {
		if (status == 500) {
			res.status(500).send("Error sending E-mail")
		} else {
			return mongodb.incNotification(data)
		}
	}).then(function() {
		res.status(200).end()
	}).catch(function(err) {
		console.log(err)
	})
})
module.exports = router
