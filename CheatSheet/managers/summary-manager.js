'use strict';

var query = require('../DBController.js');



var summaryManager = {};


summaryManager.getSummaryById = function (summaryId, callback) {
	var sqlString = "SELECT * FROM summaries WHERE summaryid = $1";
	var inputVariables = [summaryId];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
}

summaryManager.getSummaryByCourse = function (courseId, callback) {
	var sqlString = "SELECT * FROM courses WHERE";
	var inputVariables = [];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
}

summaryManager.getSummaryMetaData = function (courseId, callback) {
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

summaryManager.createSummary = function (user, content, teacherName, attendanceDate, courseId, callback) {
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

module.exports = summaryManager;