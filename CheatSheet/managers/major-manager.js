'use strict';

var query = require('../DBController.js');



var majorManager = {};


majorManager.getMajorById = function (majorId, callback) {
	var sqlString = "SELECT " +
	"majors.name AS majorName, " + // from majors table
	"departments.id AS departmentId, departments.name AS departmentName, " + // from departments table
	"school.id AS schoolId, school.name AS schoolName " + // from schools table
	"FROM majors, departments, schools WHERE majors.departmentId = departments.id AND departments.schoolid = schools.id AND majors.id = $1";
	var inputVariables = [majorId];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			var row = result.row[0];
			if(!row) return callback(null, result);
			return callback(null, {
				id : majorId,
				name : row.majorname,
				department : {
					id : parseInt(row.departmentid),
					name : row.departmentname,
					school : {
						id : parseInt(row.schoolid),
						name : row.schoolname
					}
				}
			});
		}
	});
}

majorManager.createMajor = function (name, departmentId, callback) {
	var sqlString = "INSERT INTO majors (name, departmentid) VALUES ($1, $2)";
	var inputVariables = [name, departmentid];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
}


module.exports = majorManager;