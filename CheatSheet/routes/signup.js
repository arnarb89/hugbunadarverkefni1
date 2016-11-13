'use-strict';

var express = require('express');
var router = express.Router();

var isNotAuthenticated = function (req, res, next) {
	'use strict';
	if (req.isAuthenticated()){
		res.redirect('/');
	}
	return next();
};

module.exports = function(passport){
	'use strict';

	/* GET login page. */
	router.get('/', function(req, res) {
		if(req.isAuthenticated()){
			res.redirect('/');
		}
		else{
			// Display the Signup page with any flash message, if any
			res.render('placeholder-signup', { message: req.flash('message') });
		}
	});

	/* GET Registration Page */
	/*router.get('/signup', function(req, res){
		res.render('signup',{message: req.flash('message')});
	});*/

	/* Handle Registration POST */
	router.post('/', isNotAuthenticated ,passport.authenticate('signup', {
		successRedirect: '/', //***************//
		failureRedirect: '/signup', //***************//
		failureFlash : true  
	}));


	return router;
};





