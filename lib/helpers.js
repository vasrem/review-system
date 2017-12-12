var path = require('path')
var fs = require('fs')
var Promise = require('promise')
var appDir = path.dirname(require.main.filename)

exports.fillEmail = function(review) {
	return new Promise(function(fullfill, reject) {

		var email = fs.readFileSync(appDir + '/templates/mail.html', 'utf8')
		email = email.replace(/%REVIEW%/g, review.review)

		const carrental = {
			google:	"https://search.google.com/local/writereview?placeid=ChIJbZ5SRPE_qBQROCUhqBRO6wc",
			facebook: "https://www.facebook.com/pg/carrentalthessaloniki/reviews/"
		}
		const parkfly = {
			google:"https://search.google.com/local/writereview?placeid=ChIJue03QfE_qBQRBpgsfj8dGOs",
			facebook:"https://www.facebook.com/pg/parkfly.gr/reviews/"
		}
		const carhire = {
			google:	"https://search.google.com/local/writereview?placeid=ChIJbZ5SRPE_qBQROCUhqBRO6wc",
			facebook:"https://www.facebook.com/pg/carhirethessaloniki/reviews/"
		}


		switch(review.service){
			case "CarRental":
				email = email.replace(/%LINKFACEBOOK%/g, carrental.facebook)
				email = email.replace(/%LINKGOOGLE%/g, carrental.google)
			case "CarHire":
				email = email.replace(/%LINKFACEBOOK%/g, carhire.facebook)
				email = email.replace(/%LINKGOOGLE%/g, carhire.google)
			case "Park&Fly":
				email = email.replace(/%LINKFACEBOOK%/g, parkfly.facebook)
				email = email.replace(/%LINKGOOGLE%/g, parkfly.google)
		}
		fullfill(email)
	})
}
