'use strict';

var courseManager = require('../lib/managers/course-manager');
var router = require('express').Router();
//var isAuthenticated = require('../lib/isAuthenticated');
var summaryManager = require('../lib/managers/summary-manager');

module.exports = function(passport){

	

	router.get('/:id', function (req, res) {
		var thecourseid = req.params.id;
		courseManager.getCourseByIdArnar(thecourseid, function(err,result){
			if(err){
				console.log("/course/:id get, err: "+err);
				res.render('placeholder-course',{message:'There was an error.'});
			}else{
				var breadcrumbs = result.rows[0];
				console.log("/course/:id get, result: "+JSON.stringify(result));
				console.log("/course/:id get, breadcrumbs: "+JSON.stringify(breadcrumbs));
				breadcrumbs.currentid = breadcrumbs.courseid;
				breadcrumbs.currentname = breadcrumbs.coursename;
				breadcrumbs.currenttype = 'course';
				
				//by course id
				summaryManager.getSummaryMetaData(thecourseid, function (err, result) {
					if(err){
						console.log("/course/:id get, err: "+err);
						res.render('placeholder-course', {message: 'There was an error.'});
					}else{
						console.log('/course/:id get, results: '+JSON.stringify(result));
						console.log('/course/:id get, breadCrumbs: '+JSON.stringify(breadcrumbs));
						res.render('placeholder-course', {message:null, result:result, breadcrumbs: breadcrumbs});
					}
					// return courses asyncly
					// handle error
				});
			}
		})
	});

	/*router.post('/', function (req, res) {
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
	});*/

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