'use strict';

var dptmtManager = require('../lib/managers/department-manager');
var router = require('express').Router();
var isAuthenticated = require('../lib/isAuthenticated');

router.post('/', isAuthenticated, function (req, res) {
	var dptmtName = req.body.name;
	var schoolId = req.body.schoolId;
	dptmtManager.createDepartment(dptmtName, schoolId, function (err, result) {
		if(!err) {
			res.send(result)
		} else {
			res.send(err)
		}
	});
});

module.exports = router;