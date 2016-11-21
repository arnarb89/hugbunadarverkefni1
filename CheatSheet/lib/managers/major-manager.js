'use strict';

var dbc = require('../../cs-DBcontroller/cs-DBcontroller.js');



var majorManager = {};


majorManager.getMajorByDepartmentId = function (departmentId, callback) {
	var sqlString = "SELECT " +
	"majors.id AS majorid, majors.name AS majorName, " + // from majors table
	"departments.name AS departmentName, " + // from departments table
	"schools.id AS schoolId, schools.name AS schoolName " + // from schools table
	"FROM majors, departments, schools WHERE departments.id = $1 AND majors.departmentId = departments.id AND departments.schoolId = schools.id";
	var inputVariables = [departmentId];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result.rows.map(formatMajor).map(major => { major.department.id = departmentId; return major; }));
		}
	});
}


majorManager.getMajorById = function (majorId, callback) {
	var sqlString = "SELECT " +
	"majors.name AS majorName, " + // from majors table
	"departments.id AS departmentId, departments.name AS departmentName, " + // from departments table
	"schools.id AS schoolId, schools.name AS schoolName " + // from schools table
	"FROM majors, departments, schools WHERE majors.id = $1 AND majors.departmentId = departments.id AND departments.schoolid = schools.id";
	var inputVariables = [majorId];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result.rows.map(formatMajor).map(major => { major.id = majorId; return major; }));
		}
	});
}

majorManager.createMajor = function (name, departmentId, callback) {
	var sqlString = "INSERT INTO majors (name, departmentid) VALUES ($1, $2) RETURNING *";
	var inputVariables = [name, departmentId];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result.rows.map(formatMajor));
		}
	});
}

function formatMajor(unformattedMajor) {
	return {
		id : unformattedMajor.id !== undefined ? unformattedMajor.id : unformattedMajor.majorid,
		name : unformattedMajor.name !== undefined ? unformattedMajor.name : unformattedMajor.majorname,
		department : {
			id : unformattedMajor.departmentid,
			name : unformattedMajor.departmentname,
			school : {
				id : unformattedMajor.schoolid,
				name : unformattedMajor.schoolname
			}
		}
	};
};


module.exports = majorManager;