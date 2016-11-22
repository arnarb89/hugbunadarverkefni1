'use strict';

var courseManager = require('../lib/managers/course-manager');
var router = require('express').Router();
//var isAuthenticated = require('../lib/isAuthenticated');

module.exports = function(passport){

	router.get('/', function (req, res) {
		// render summary metadatalist
		summaryManager.getSummaryMetaData(req.body.courseId, function (err, result) {
			// render summary metadata table with results
			// handle error
			res.render('course', { title: 'Courses', summaryMeta:result });
		});
	});

	router.post('/', function (req, res) {
		if(!req.isAuthenticated()){
			res.redirect('/');
		}
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

	router.post('/addnewcourse', function (req, res) {
		if(!req.isAuthenticated()){
			console.log('/addnewcourse, user is not authenticated.');
			return res.json({error: 'You are not authenticated.'});
		}
		var courseName = req.body.coursename;
		var courseCode = req.body.courseidentificationcode;
		var majorId = req.body.majorid;
		courseManager.createCourse(courseName, courseCode, majorId, function (err, result) {
			if(err) {
				console.log('/addnewcourse, err: '+err);
				return res.json({error: "There was an error."});
			} else {
				console.log('/addnewcourse, success');
				return res.json({success: 'Course has been successfully added.'});
			}
		});
	});
	return router;

};