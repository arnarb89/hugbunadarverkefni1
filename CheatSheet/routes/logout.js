'use strict';

var express = require('express');
var router = express.Router();

module.exports = function(passport){
	/* Handle Logout */
  	router.get('/', function(req, res) {
    	req.logout();
    	res.redirect('/');
  	});


	return router;
};





