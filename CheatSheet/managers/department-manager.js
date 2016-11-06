'use strict';

var query = require('../DBController.js');



var departmentManager = {};


departmentManager.getDepartmentById = function (departmentId, callback) {
	var sqlString = "SELECT " +
	"departments.name AS departmentName, " + // from department table
	"schools.id AS schoolId, schools.name AS schoolName " + // from school table
	"FROM departments, schools WHERE departments.schoolId = schools.id AND departments.id = $1";
	var inputVariables = [departmentId];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			var row = result.row[0];
			if(!row) return callback(null, result);
			return callback(null, {
				id : departmentId,
				name : row.departmentname,
				school : {
					id : parseInt(row.schoolid),
					name : row.schoolname
				}
			});
		}
	});
}

departmentManager.createDepartment = function (name, schoolId, callback) {
	var sqlString = "INSERT INTO departments (name, schoolId) VALUES ($1, $2)";
	var inputVariables = [name, schoolId];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
}


module.exports = departmentManager;