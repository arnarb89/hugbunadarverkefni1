'use strict';

var courseManager = require('../lib/managers/course-manager.js');
var router = require('express').Router();

router.get('/', function (req, res) {
	// render summary metadatalist
	summaryManager.getSummaryMetaData(req.body.courseId, function (err, result) {
		// render summary metadata table with results
		// handle error
		res.render('index', { title: '/course/get', summaryMeta:result });
	});
});

router.post('/', function (req, res) {
	var courseName = req.body.name;
	var courseCode = req.body.identificationCode;
	var majorId = req.body.majorId;
	courseManager.createCourse(courseName, courseCode, majorId, function (err, result) {
		// render success/fail of course creation
		res.render('index', { title: '/course/post', success:result });
	});
});

module.exports = router;