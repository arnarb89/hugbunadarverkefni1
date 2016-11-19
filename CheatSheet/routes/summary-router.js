'use strict';

var summaryManager = require('../lib/managers/summary-manager');
router = require('express').Router();
var isAuthenticated = require('../lib/isAuthenticated');

router.get('/', function (req, res) {
	summaryManager.getSummaryById(req.body.summaryId, function(err, result) {
		if(!err) {
			res.render('index', { title: 'Summary', summary:result});
		} else {
			res.render('index', { title: 'Summary', summary:result});
		}
	});
});

router.get('/create', isAuthenticated, function (req, res) {
	// expects req.body.courseId
	// render summary form, tagged with courseId
	res.render('index', { title: '/summary/get'});
});

router.post('/create', isAuthenticated, function (req, res) {
	var content = req.body.content;
	var teacherName = req.body.teacherName;
	// Maybe reformat date somehow
	var attendance = req.body.attendanceDate;
	summaryManager.createSummary(req.body.user, content, teacherName, attendance, function (err, result) {
		if(!err) {
			res.send(result)
		} else {
			res.send(err)
		}
	});
});


module.exports = router