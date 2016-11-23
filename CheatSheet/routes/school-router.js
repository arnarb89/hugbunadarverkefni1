'use strict';

var schoolManager = require('../lib/managers/school-manager.js');
var router = require('express').Router();

module.exports = function(passport) {

	router.post('/', function (req, res) {
		console.log(req.body)
		if(req.isAuthenticated()){
			schoolManager.createSchool(req.body.schoolName, function (err, result) {
				if(!err) {
					res.send({success:result});
				} else {
					console.log({error:err});
				}
			});
		} else {
			res.status(401).send();
		}
	});

	return router;
};