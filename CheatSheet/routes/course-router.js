'use strict';

var courseManager = require('../lib/managers/course-manager.js');
var router = require('express').Router();

router.get('/', function (req, res) {
	// render summary metadatalist
	summaryManager.getSummaryMetaData(req.body.courseId, function(err, result) {
		// render summary metadata table with results
		// handle error
	});
});

router.post('/', function (req, res) {
	var courseName = req.body.name;
	var courseCode = req.body.identificationCode;
	var majorId = req.body.majorId;
	courseManager.createCourse(courseName, courseCode, majorId, function () {
		// render success/fail of course creation
	});
});

module.exports = router;