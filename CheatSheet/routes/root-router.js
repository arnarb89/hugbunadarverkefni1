'use strict';
var express = require('express');
var router = express.Router();
var schoolManager = require('../lib/managers/school-manager');

module.exports = function(passport) {
	router.get('/', function done(req, res) {
		schoolManager.getSchools(function done(err, result) {
			if(!err) {
				res.render('root', {
					getLatestComments: true,
					result:result
				});
			} else {
				res.status(404).send();
			}
		});
	});

	return router;
};