'use strict';

var accountManager = require('../lib/managers/account-manager');
var router = require('express').Router();
var userManager = require('../cs-managers/userManager.js');
var bCrypt = require('bcrypt-nodejs');


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
			var renderData = {};
			res.render('placeholder-account', { renderData, message: req.flash('message') });
		}
    	
	});

	/* Handle Login POST */
	router.post('/', isNotAuthenticated, function(req,res){



	}
	);


	return router;
};