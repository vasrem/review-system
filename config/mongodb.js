var MongoClient = require('mongodb').MongoClient

var domain = process.env.DOMAIN || "localhost"
exports.url = 'mongodb://' + domain + ':27017/review_system'

exports.client = MongoClient
