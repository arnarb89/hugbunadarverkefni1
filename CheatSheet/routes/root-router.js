'use strict';
var router = require('express').Router();
var schoolManager = require('../lib/managers/school-manager.js');


module.exports = function(passport) {

	router.get('/', function done(req, res) {
		schoolManager.get(req.body.name, schoolId, function done(err, result) {
			// send success and 
			// error handling
			res.render('index', {title:'root'});
		});
	};

};

