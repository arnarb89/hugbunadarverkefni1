'use strict';

var dptmtManager = require('../lib/managers/department-manager');
var router = require('express').Router();

module.exports = function(passport) {
	router.post('/create', function (req, res) {
		var dptmtName = req.body.departmentName;
		var schoolId = req.body.schoolId;
		if(req.isAuthenticated()) {
			dptmtManager.createDepartment(dptmtName, schoolId, function (err, result) {
				if(!err) {
					res.send(result)
				} else {
					res.send(err)
				}
			});
		} else {
			res.send(401);
		}
	});
	
	router.post('/', function(req, res) {
		dptmtManager.getDepartmentBySchoolId(
			req.body.schoolId, function cb(err, result) {
			if(!err) {
				res.send(result);
			} else {
				res.status(404);
			}
		})
	});

	return router;
}