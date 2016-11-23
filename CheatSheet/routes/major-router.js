'use strict';

var courseManager = require('../lib/managers/course-manager');
var majorManager = require('../lib/managers/major-manager');
var router = require('express').Router();

var isNotAuthenticated = function (req, res, next) {
	'use strict';
	if (req.isAuthenticated()){
		return next();
		
	}
	res.redirect('/');
};
 
module.exports = function(passport){

	router.get('/:id', function (req, res) {
		majorManager.getMajorByIdArnar(req.params.id, function(err,result){
			if(err){
				console.log("/major/:id get, err: "+err);
				res.render('placeholder-major',{message:'There was an error.'});
			}else{
				var breadcrumbs = result.rows[0];
				breadcrumbs.currentid = breadcrumbs.majorid;
				breadcrumbs.currentname = breadcrumbs.majorname;
				breadcrumbs.currenttype = 'major';
				
				// async request
				//console.log('/major/:id :id is: '+req.params.id);
				courseManager.getCourseByMajorId(req.params.id, function (err, result) {
					if(err){
						console.log("/major/:id get, err: "+err);
						res.render('placeholder-major', {message: 'There was an error.'});
					}else{
						console.log('/major/:id get, result.rows: '+JSON.stringify(result));
						console.log('get /major/:id, breadCrumbs: '+JSON.stringify(breadcrumbs));
						res.render('placeholder-major', {message:null, result:result, breadcrumbs: breadcrumbs});
					}
					// return courses asyncly
					// handle error
				});
			}
		})
	});

	router.post('/async', function(req, res) {
		majorManager.getMajorByDepartmentId(
			req.body.departmentId, function(err, result) {
			console.log('hello majorasync');
			if(!err) {
				res.send(result);		
			} else {
				res.status(404);
			}

		});
	});

	router.post('/addnewmajor', function (req, res) {
		if(!req.isAuthenticated()){
			console.log('/addnewmajor, user is not authenticated.');
			return res.json({error: 'You are not authenticated.'});
		}
		var majorName = req.body.majorname;
		var departmentId = req.body.departmentid;
		majorManager.createMajor(majorName, departmentId, function (err, result) {
			if(err) {
				console.log('/addnewmajor, err: '+err);
				return res.json({error: "There was an error."});
			} else {
				console.log('/addnewmajor, success');
				return res.json({success: 'Major has been successfully created.'});
			}
		});
	});
	return router;
};
