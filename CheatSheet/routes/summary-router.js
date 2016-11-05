'use strict';

var summaryManager = require('../lib/managers/summary-manager.js');
router = require('express').Router();

router.get('/', function () {
	summaryManager.getSummaryById(req.body.summaryId, function(err, result) {
		// render summary in results
		// handle error
	});
});

router.get('/create', function () {
	// expects req.body.courseId
	// render summary form, tagged with courseId
});

router.post('/create', content, teacherName, attendanceDate, courseId, function () {
	var content = req.body.content;
	var teacherName = req.body.teacherName;
	// Maybe reformat date somehow
	var attendance = req.body.attendanceDate;
	summaryManager.createSummary(req.body.user, content, teacherName, attendance, function(err, result) {
		// render success/fail page OR
		// redirect user to /summary with the right id?
	});
});


module.exports = router