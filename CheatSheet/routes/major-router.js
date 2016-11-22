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
				var majorBreadcrumbs = result.rows[0];
				majorBreadcrumbs.currentid = majorBreadcrumbs.majorid;
				majorBreadcrumbs.currentname = majorBreadcrumbs.majorname;
				majorBreadcrumbs.currenttype = 'major';
				
				// async request
				//console.log('/major/:id :id is: '+req.params.id);
				courseManager.getCoursesByMajorIdArnar(req.params.id, function (err, result) {
					if(err){
						console.log("/major/:id get, err: "+err);
						res.render('placeholder-major', {message: 'There was an error.'});
					}else{
						console.log('/major/:id get, result.rows: '+JSON.stringify(result.rows));
						console.log('get /major/:id, breadCrumbs: '+JSON.stringify(majorBreadcrumbs));
						res.render('placeholder-major', {message:null, result:result.rows, breadcrumbs: majorBreadcrumbs});
					}
					// return courses asyncly
					// handle error
				});
			}
		})
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
