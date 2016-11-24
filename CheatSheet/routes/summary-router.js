'use strict';

var summaryManager = require('../lib/managers/summary-manager');
var express = require('express');
var router = express.Router();
var moment = require('moment');

module.exports = function(passport) {
	
	router.get('/', function (req, res) {
		summaryManager.getSummaryById(req.body.summaryId, function(err, result) {
			if(!err) {
				res.render('summarycreate', { title: 'Summary', summary:result});
			} else {
				res.render('summarycreate', { title: 'Summary', summary:result});
			}
		});
	});

	router.get('/create/:id', function(req, res) {
		var courseId = req.params.id;
		res.render('summarycreate',{
			courseId:courseId
		});
	});

	router.post('/create/:id', function(req, res) {
		
		var courseId = req.params.id;
		var content = req.body.content;
		var teacherName = req.body.teacherName;
		var attendanceDate = moment(req.body.attendaneDate).format();
		
		console.log('someone wants to create summary');
		console.log(JSON.stringify(req.body))
		if(req.isAuthenticated()) { // <== checkar hvort notandi se skradur inn
									// getur verid thaegilegra ad debugga an thess ad checka permission fyrst samt
			summaryManager.createSummary(req.user, content, teacherName, attendanceDate, courseId, function(err, result) {
				
				res.redirect('/summary/'+result[0].course.id);
			});
			
			
		} else {
			res.status(401).send(); // status code sem thydir unauthorized access (no permission)
		}
	});

	return router;
}
