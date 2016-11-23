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
			// Display the Login page with any flash message, if any
		res.render('placeholder-login', { message: req.flash('message') });
		}
    	
	});

	/* Handle Login POST */
	router.post('/', isNotAuthenticated,passport.authenticate('login', {
		successRedirect: '/', //*****************//
		failureRedirect: '/login',		//*****************//
		failureFlash : true  
	}));


	return router;
};





