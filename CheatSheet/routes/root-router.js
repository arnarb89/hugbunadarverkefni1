'use strict';

var schoolManager = require('../lib/managers/school-manager.js');
var router = require('express').Router();

router.get('/', function (req, res) {
	schoolManager.get(req.body.name, schoolId, function (err, result) {
		// send success and 
		// error handling
		res.render('index', {title:'root'});
	});
});

module.exports = router;