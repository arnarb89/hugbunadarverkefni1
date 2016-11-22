'use strict';

var dbc = require('../../cs-DBcontroller/cs-DBcontroller.js');



var schoolManager = {};


schoolManager.getSchoolById = function (schoolId, callback) {
	var sqlString = "SELECT id, name FROM schools WHERE id = $1";
	var inputVariables = [schoolId];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result.rows.map(formatSchool)[0]);
		}
	});
}

schoolManager.createSchool = function (name, callback) {
	var sqlString = "INSERT INTO schools (name) VALUES ($1) RETURNING *";
	var inputVariables = [name];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result.rows.map(formatSchool)[0]);
		}
	});
}

schoolManager.getSchools = function (callback) {
	var sqlString = "SELECT id, name FROM schools";
	var inputVariables = [];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result.rows.map(formatSchool));
		}
	});
}

function formatSchool(unformattedSchool) {
	return {
		id : unformattedSchool.id,
		name : unformattedSchool.name
	};
};


module.exports = schoolManager;