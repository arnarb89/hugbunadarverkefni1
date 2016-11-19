'use strict';

var query = require('../DBController.js');



var departmentManager = {};

departmentManager.getDepartmentBySchoolId = function (schoolId, callback) {
	var sqlString = "SELECT " +
	"departments.id AS departmentId, departments.name AS departmentName " + // from departments table
	"schools.name AS schoolName " + // from schools table
	"FROM departments, schools WHERE schools.id = $1 AND department.schoolId = schools.id";
	var inputVariables = [schoolId];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			var resultArray = result.rows;
			var departmentArray = [];

			// converting the result to hierarchy of objects, converting to correct types and leaving behind unnecessary variables
			for(var i in resultArray) {
				departmentArray[i].id = parseInt(resultArray[i].departmentid);
				departmentArray[i].name = resultArray[i].departmentname;
				departmentArray[i].school = {
					id : schoolId,
					name : resultArray[i].schoolname
				}
			}

			return callback(null, departmentArray);
		}
	});
}

departmentManager.getDepartmentById = function (departmentId, callback) {
	var sqlString = "SELECT " +
	"departments.name AS departmentName, " + // from department table
	"schools.id AS schoolId, schools.name AS schoolName " + // from school table
	"FROM departments, schools WHERE departments.id = $1 AND departments.schoolId = schools.id";
	var inputVariables = [departmentId];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			var row = result.rows[0];
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