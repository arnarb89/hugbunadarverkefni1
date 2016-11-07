var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
		if(req.isAuthenticated())res.redirect('/');
		else{
			// Display the Signup page with any flash message, if any
			res.render('placeholder-signup', { message: req.flash('message') });
		};
	});

	/* GET Registration Page */
	/*router.get('/signup', function(req, res){
		res.render('signup',{message: req.flash('message')});
	});*/

	/* Handle Registration POST */
	router.post('/', passport.authenticate('signup', {
		successRedirect: '/', //***************//
		failureRedirect: '/signup', //***************//
		failureFlash : true  
	}));


	return router;
}





