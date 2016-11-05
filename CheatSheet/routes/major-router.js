'use strict';

var courseManager = require('../lib/managers/course-manager.js');
var majorManager = require('../lib/managers/major-manager.js');
var router = require('express').Router();

router.get('/', function (req, res) {
	// async request
	courseManager.getCourseByMajor(req.body.majorId, function(err, result) {
		// return courses asyncly
		// handle error
	});
});

router.post('/', function (req, res) {
	var majorName = req.body.name;
	var dptmtId = req.body.departmentId;
	majorManager.createMajor(majorName, dptmtId, function () {
			// send success and 
			// error handling
	});
});

module.exports = router;