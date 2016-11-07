'use strict';

var summaryManager = require('../lib/managers/summary-manager');
router = require('express').Router();
var isAuthenticated = require('../lib/isAuthenticated');

router.get('/', function (req, res) {
	summaryManager.getSummaryById(req.body.summaryId, function(err, result) {
		if(!err) {
			res.render('index', { title: 'Summary', summary:result});
		} else {
			res.render('index', { title: 'Summary', error:err});
		}
	});
});

router.get('/create', isAuthenticated, function (req, res) {
	res.render('createsummary', { title: 'Create Summary'});
});

router.post('/create', isAuthenticated, function (req, res) {
	var content = req.body.content;
	var teacherName = req.body.teacherName;
	// Maybe reformat date somehow
	var attendance = req.body.attendanceDate;
	summaryManager.createSummary(req.body.user, content, teacherName, attendance, function (err, result) {
		if(!err) {
			res.send(JSON.stringify(result));
		} else {
			res.send(err):
		}
	});
});


module.exports = router