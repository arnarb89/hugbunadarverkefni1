'use strict';

var schoolManager = require('../lib/managers/school-manager.js');
var router = require('express').Router();

router.post('/', function (req, res) {
	schoolManager.createSchool(req.body.name, schoolId, function (err, result) {
			// send success and 
			// error handling
	});
});

module.exports = router;