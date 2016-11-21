'use strict';

var dbc = require('../../cs-DBcontroller/cs-DBcontroller.js');



var departmentManager = {};

departmentManager.getDepartmentBySchoolId = function (schoolId, callback) {
	var sqlString = "SELECT " +
	"departments.id AS departmentId, departments.name AS departmentName, " + // from departments table
	"schools.name AS schoolName " + // from schools table
	"FROM departments, schools WHERE schools.id = $1 AND departments.schoolId = schools.id";
	var inputVariables = [schoolId];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result.rows.map(formatDepartment).map(department => { department.school.id = schoolId; return department; }));
		}
	});
}

departmentManager.getDepartmentById = function (departmentId, callback) {
	var sqlString = "SELECT " +
	"departments.name AS departmentName, " + // from department table
	"schools.id AS schoolId, schools.name AS schoolName " + // from school table
	"FROM departments, schools WHERE departments.id = $1 AND departments.schoolId = schools.id";
	var inputVariables = [departmentId];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result.rows.map(formatDepartment).map(department => { department.id = departmentId; return department; }));
		}
	});
}

departmentManager.createDepartment = function (name, schoolId, callback) {
	var sqlString = "INSERT INTO departments (name, schoolId) VALUES ($1, $2) RETURNING *";
	var inputVariables = [name, schoolId];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result.rows.map(formatDepartment));
		}
	});
}

function formatDepartment(unformattedDepartment) {
	return {
		id : unformattedDepartment.id !== undefined ? unformattedDepartment.id : unformattedDepartment.departmentid,
		name : unformattedDepartment.name !== undefined ? unformattedDepartment.name : unformattedDepartment.departmentname,
		school : {
			id : unformattedDepartment.schoolid,
			name : unformattedDepartment.schoolname
		}
	};
};


module.exports = departmentManager;