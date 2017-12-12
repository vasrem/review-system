exports.checkIfAuthorized = function(req, res, next) {
	if (req.user) {
		next()
	} else {
		res.redirect('/login')
	}
}
exports.checkIfAuthorizedToAdmin = function(req, res, next) {
	if (req.user.isAdmin) {
		next()
	} else {
		res.status(403).send("Sorry! You can't use that.");
	}
}
exports.redirectToPanel = function(req, res, next) {
	if (req.user) {
		res.redirect('/admin')
	} else {
		next()
	}
}
