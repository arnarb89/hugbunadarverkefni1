'use strict';

var summaryManager = require('../lib/managers/summary-manager.js');
router = require('express').Router();

router.get('/', function (req, res) {
	summaryManager.getSummaryById(req.body.summaryId, function(err, result) {
		// render summary in results
		// handle error
	});
});

router.get('/create', function (req, res) {
	// expects req.body.courseId
	// render summary form, tagged with courseId
	res.render('index', { title: '/summary/get'});
});

router.post('/create', function (req, res) {
	var content = req.body.content;
	var teacherName = req.body.teacherName;
	// Maybe reformat date somehow
	var attendance = req.body.attendanceDate;
	summaryManager.createSummary(req.body.user, content, teacherName, attendance, function (err, result) {
		// render success/fail page OR
		// redirect user to /summary with the right id?
		res.render('index', { title: '/summary/get', summaries:result});
	});
});


module.exports = router