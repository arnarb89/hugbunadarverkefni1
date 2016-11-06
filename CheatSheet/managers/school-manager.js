'use strict';

var query = require('../DBController.js');



var schoolManager = {};


schoolManager.getSchoolById = function (schoolId, callback) {
	var sqlString = "SELECT name FROM schools WHERE id = $1";
	var inputVariables = [schoolId];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			var row = result.row[0];
			if(!row) return callback(null, result);
			return callback(null, {id : schoolId, name : result.row[0].name});
		}
	});
}

schoolManager.createSchool = function (name, callback) {
	var sqlString = "INSERT INTO schools (name) VALUES ($1)";
	var inputVariables = [name];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
}

schoolManager.getSchools = function (callback) {
	var sqlString = "SELECT id, name FROM schools";
	var inputVariables = [];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			var schoolArray = result.row;

			for(var i in schoolArray) {
				schoolArray[i].id = parseInt(schoolArray[i].id);
			}

			return callback(null, schoolArray);
		}
	});
}


module.exports = schoolManager;