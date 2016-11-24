'use strict';

var summaryManager = require('../lib/managers/summary-manager');
var express = require('express');
var router = express.Router();
var moment = require('moment');

module.exports = function(passport) {
	router.get('/:id', function (req, res) {
		summaryManager.getSummaryById(req.params.id, function(err, result) {
			if(err) {
				res.render('error', { error : err, message : "I'm sorry, the internet has exploded." });				
			} else {
				res.render('summary', { title : 'Summary', summary : result, contentInfo : { type : 'summary', id : result.id } });
			}
		});
	});

	router.get('/create/:id', function(req, res) {
		res.render('summarycreate', { title: 'Create summary', courseId : req.params.id });
	});

	router.post('/create/:id', function(req, res) {
		
		var courseId = req.params.id;
		var content = req.body.content;
		var teacherName = req.body.teacherName;
		var attendanceDate = moment(req.body.attendaneDate).format();
		
		console.log('Someone wants to create summary');
		console.log(JSON.stringify(req.body))
		if(req.isAuthenticated()) { // <== checkar hvort notandi se skradur inn
									// getur verid thaegilegra ad debugga an thess ad checka permission fyrst samt
			summaryManager.createSummary(req.user, content, teacherName, attendanceDate, courseId, function(err, result) {
				console.log(result);
				res.redirect('/summary/'+result.id);
			});
			
			
		} else {
			res.status(401).send(); // status code sem thydir unauthorized access (no permission)
		}
	});

	return router;
}
