'use strict';

var dbc = require('../../cs-DBcontroller/cs-DBcontroller.js');



var majorManager = {};


majorManager.getMajorByDepartmentId = function (departmentId, callback) {
	var sqlString = "SELECT " +
	"majors.id AS majorid, majors.name AS majorName, " + // from majors table
	"departments.name AS departmentName, " + // from departments table
	"schools.id AS schoolId, schools.name AS schoolName " + // from schools table
	"FROM majors, departments, schools WHERE departments.id = $1 AND majors.departmentId = departments.id AND department.schoolId = schools.id";
	var inputVariables = [departmentId];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			var resultArray = result.rows;
			var majorArray = [];

			// converting the result to hierarchy of objects, converting to correct types and leaving behind unnecessary variables
			for(var i in resultArray) {
				majorArray[i].id = parseInt(resultArray[i].majorid);
				majorArray[i].name = resultArray[i].majorname;
				majorArray[i].idetificationCode = resultArray[i].identificationcode;
				majorArray[i].department = {
					id : departmentId,
					name : resultArray[i].departmentname,
					school : {
						id : parseInt(resultArray[i].schoolid),
						name : resultArray[i].schoolname
					}
				}
			}

			return callback(null, majorArray);
		}
	});
}


majorManager.getMajorByIdArnar = function (majorId, callback) {
	var sqlString = "SELECT " +
	"majors.name AS majorName, majors.id AS majorId, " + // from majors table
	"departments.id AS departmentId, departments.name AS departmentName, " + // from departments table
	"schools.id AS schoolId, schools.name AS schoolName " + // from schools table
	"FROM majors, departments, schools WHERE majors.id = $1 AND majors.departmentId = departments.id AND departments.schoolid = schools.id";
	var inputVariables = [majorId];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err,null);
		} else {
			/*
			var row = result.rows[0];
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
			});*/
			return callback(null,result);
		}
	});
}

majorManager.createMajor = function (name, departmentId, callback) {
	var sqlString = "INSERT INTO majors (name, departmentid) VALUES ($1, $2);";
	var inputVariables = [name, departmentid];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err,null);
		} else {
			return callback(null, result);
		}
	});
}


module.exports = majorManager;