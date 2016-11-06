'use strict';

var courseManager = require('../lib/managers/course-manager');
var router = require('express').Router();
var isAuthenticated = require('../lib/isAuthenticated');

router.get('/', function (req, res) {
	// render summary metadatalist
	summaryManager.getSummaryMetaData(req.body.courseId, function (err, result) {
		// render summary metadata table with results
		// handle error
		res.render('course', { title: 'Courses', summaryMeta:result });
	});
});

router.post('/', isAuthenticated, function (req, res) {
	var courseName = req.body.name;
	var courseCode = req.body.identificationCode;
	var majorId = req.body.majorId;
	courseManager.createCourse(courseName, courseCode, majorId, function (err, result) {
		if(!err) {
			res.send(result)
		} else {
			res.send(err)
		}
	});
});

module.exports = router;