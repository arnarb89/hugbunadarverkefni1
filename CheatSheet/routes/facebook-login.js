var express = require('express');
var router = express.Router();



module.exports = function(passport){
	'use strict';

	// route for facebook authentication and login
	// different scopes while logging in
	router.get('/', 
	  	function (req, res, next) {
	  		if(req.isAuthenticated()){
  				res.redirect('/');
  			}
	  		else{
	  			next();
	  		}
	  	},passport.authenticate('facebook', { scope : ['email'] })
	);

	/*router.get('/', function(req, res) {
			if(req.isAuthenticated())res.redirect('/');
			else passport.authenticate('facebook', { scope : ['email'] });
		}
	);*/
	 
	// handle the callback after facebook has authenticated the user
	router.get('/callback',
	  	passport.authenticate('facebook', {
	    	successRedirect : '/',
	    	failureRedirect : '/'
	  	})
	);


	return router;
};