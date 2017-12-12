var mongodb = require('../config/mongodb')
var bcrypt = require('bcrypt')

const saltRounds = 10;

// Checks connectivity
exports.checkMongo = function() {
	return new Promise(function(fullfill, reject) {
		mongodb.client.connect(mongodb.url, function(err, db) {
			if (err) {
				reject(err)
			} else {
				console.log("Connection established with mongodb..")
				db.close()
				fullfill()
			}
		})
	})
}

// Gets db object
exports.connect = function() {
	return new Promise(function(fullfill, reject) {
		mongodb.client.connect(mongodb.url, function(err, db) {
			if (err) {
				reject(err)
			} else {
				fullfill(db)
			}
		})
	})
}

// Autoincrement function for _id of collections
function _getNextSequence(name, db) {
	return new Promise(function(fullfill, reject) {
		var ret = db.collection('counters').findOneAndUpdate({
			_id: name
		}, {
			$inc: {
				seq: 1
			}
		}, {
			new: true
		}).then(function(result) {
			fullfill(result.value.seq)
		}).catch(function(err) {
			reject(err)
		})
	})
}

// Insert new review to database 
exports.insertReview = function(data) {
	return new Promise(function(fullfill, reject) {
		var database = ""
		exports.connect().then(function(db) {
			database = db
			return _insertReview(db, data)
		}).then(function(newReview) {
			database.close()
			fullfill(newReview)
		})
	})
}

// Local function to insert review
function _insertReview(db, data) {
	return new Promise(function(fullfill, reject) {
		var collection = db.collection('reviews')
		// Get next ID
		var nextID = ""
		_getNextSequence("reviewid", db).then(function(seq) {
			nextID = seq
			return collection.insert({
				_id: nextID,
				name: data['name'],
				email: data['email'],
				stars: data['stars'],
				review: data['review'],
				service: data['service'],
				notifications: 0,
				timestamp: Date.now()
			})
		}).then(function(result) {
			fullfill(result)
		}).catch(function(err) {
			reject(err)
		})

	})
}

// Get 10 reviews 
// Needs {page:}
exports.getReviews = function(data) {
	return new Promise(function(fullfill, reject) {
		var database = ""
		exports.connect().then(function(db) {
			database = db
			return _getReviews(db, data)
		}).then(function(reviews) {
			database.close()
			fullfill(reviews)
		})
	})
}

// Local function to get reviews
function _getReviews(db, data) {
	var page = data['page'] - 1
	return new Promise(function(fullfill, reject) {
		var collection = db.collection('reviews')
		return collection.find().sort({
			$natural: -1
		}).skip(10 * page).limit(10).toArray().then(function(result) {
			fullfill(result)
		}).catch(function(err) {
			reject(err)
		})
	})
}

// Get Review by id
// Needs {id:}
exports.getReviewByID = function(obj) {
	return new Promise(function(fullfill, reject) {
		var database = ""
		exports.connect().then(function(db) {
			database = db
			return _getReviewByID(db, obj)
		}).then(function(review) {
			database.close()
			fullfill(review)
		})
	})
}

// Local function to get review by id
function _getReviewByID(db, obj) {
	return new Promise(function(fullfill, reject) {
		var collection = db.collection('reviews')
		return collection.findOne({
			_id: obj['id']
		}).then(function(result) {
			fullfill(result)
		}).catch(function(err) {
			reject(err)
		})
	})
}

// Increase notification # of a review by ID
// Needs {id:}
exports.incNotification = function(obj) {
	return new Promise(function(fullfill, reject) {
		var database = ""
		exports.connect().then(function(db) {
			database = db
			return _incNotification(db, obj)
		}).then(function(result) {
			database.close()
			fullfill(result)
		})
	})
}

// Local function to increase notification # of a review by ID
function _incNotification(db, obj) {
	return new Promise(function(fullfill, reject) {
		var ret = db.collection('reviews').findOneAndUpdate({
			_id: obj.id
		}, {
			$inc: {
				notifications: 1
			}
		}, {
			new: true
		}).then(function(result) {
			fullfill(result.value)
		}).catch(function(err) {
			reject(err)
		})
	})
}

// Get reviews count 
exports.getReviewsCount = function() {
	return new Promise(function(fullfill, reject) {
		var database = ""
		exports.connect().then(function(db) {
			database = db
			return _getReviewsCount(db)
		}).then(function(count) {
			database.close()
			fullfill(count)
		})
	})
}

// Local function to get reviews count
function _getReviewsCount(db) {
	return new Promise(function(fullfill, reject) {
		var collection = db.collection('reviews')
		return collection.count().then(function(result) {
			fullfill(result)
		}).catch(function(err) {
			reject(err)
		})
	})
}


// Insert new user to database 
// Needs {username:,password:}
exports.insertUser = function(user) {
	return new Promise(function(fullfill, reject) {
		var database = ""
		exports.connect().then(function(db) {
			database = db
			return _insertUser(db, user)
		}).then(function(newUser) {
			database.close()
			fullfill(newUser)
		})
	})
}

// Local function to insert user
function _insertUser(db, user) {
	return new Promise(function(fullfill, reject) {
		user['password'] = bcrypt.hashSync(user['password'], saltRounds)
		var collection = db.collection('users')
		// Get next ID
		var nextID = ""
		_getNextSequence("userid", db).then(function(seq) {
			nextID = seq
			return collection.insert({
				_id: nextID,
				username: user['username'],
				password: user['password'],
				active: false,
				isAdmin: false

			})
		}).then(function(result) {
			fullfill(result)
		}).catch(function(err) {
			reject(err)
		})

	})
}

// Find user using username
// Needs {username:}
exports.findUser = function(obj) {
	return new Promise(function(fullfill, reject) {
		var database = ""
		exports.connect().then(function(db) {
			database = db
			return _findUser(db, obj)
		}).then(function(res) {
			database.close()
			fullfill(res)
		})
	})
}

// Local function to find user by email
function _findUser(db, obj) {
	return new Promise(function(fullfill, reject) {
		var collection = db.collection('users')
		// Get next ID
		var nextID = ""
		return collection.findOne({
			username: obj['username'],
		}).then(function(result) {
			fullfill(result)
		}).catch(function(err) {
			reject(err)
		})
	})
}
