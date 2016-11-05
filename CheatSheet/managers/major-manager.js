'use strict';

var query = require('../DBController.js');



var majorManager = {};


majorManager.getMajorById = function (majorId, callback) {
	var sqlString = "";
	var inputVariables = [];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
}

majorManager.createMajor = function (name, departmentId, callback) {
	var sqlString = "";
	var inputVariables = [];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
}


module.exports = majorManager;