'use strict';

var query = require('../DBController.js');



var courseManager = {};


courseManager.getCourseByMajor = function (majorId, callback) {
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

courseManager.getCourseById = function (courseId, callback) {
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

courseManager.createCourse = function (name, identificationCode, majorId, callback) {
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

module.exports = courseManager;