'use strict';

var dptmtManager = require('../lib/managers/department-manager.js');
var router = require('express').Router();

router.post('/', function (req, res) {
	var dptmtName = req.body.name;
	var schoolId = req.body.schoolId;
	dptmtManager.createDepartment(dptmtName, schoolId, function (err, result) {
			// send success and 
			// error handling
	});
});

module.exports = router;