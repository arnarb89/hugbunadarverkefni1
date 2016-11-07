'use strict';

var courseManager = require('../lib/managers/course-manager');
var majorManager = require('../lib/managers/major-manager');
var router = require('express').Router();

router.get('/', function (req, res) {
	// async request
	courseManager.getCourseByMajor(req.body.majorId, function (err, result) {
	majorManager.createMajor(majorName, dptmtId, function (err, result) {
		if(!err) {
			res.render('major', { title: 'Major', courses:result});
		} else {
			res.render('major', { title: 'Major', error:err});
		}
	});
	});
});

router.post('/', isAuthenticated, function (req, res) {
	var majorName = req.body.name;
	var dptmtId = req.body.departmentId;
	majorManager.createMajor(majorName, dptmtId, function (err, result) {
		if(!err) {
			res.send(result)
		} else {
			res.send(err)
		}
	});
});

module.exports = router;