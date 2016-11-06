'use strict';

var query = require('../DBController.js');



var courseManager = {};


courseManager.getCourseByMajorId = function (majorId, callback) {
	var sqlString = "SELECT " +
	"courses.id AS courseId, courses.name AS courseName, courses.identificationCode, " + // from courses table
	"majors.name AS majorName, " + // from majors table
	"departments.id AS departmentId, departments.name AS departmentName " + // from departments table
	"schools.id AS schoolId, schools.name AS schoolName " + // from schools table
	"FROM courses, majors, departments, schools WHERE majors.id = $1 AND courses.majorId = majors.id AND majors.departmentId = departments.id AND department.schoolId = schools.id";
	var inputVariables = [majorId];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			var resultArray = result.row;
			var courseArray = [];

			// converting the result to hierarchy of objects, converting to correct types and leaving behind unnecessary variables
			for(var i in resultArray) {
				courseArray[i].id = parseInt(resultArray[i].courseid);
				courseArray[i].name = resultArray[i].coursename;
				courseArray[i].idetificationCode = resultArray[i].identificationcode;
				courseArray[i].major = {
					id : majorId,
					name : resultArray[i].majorname,
					department : {
						id : parseInt(resultArray[i].departmentid),
						name : resultArray[i].departmentname,
						school : {
							id : parseInt(resultArray[i].schoolid),
							name : resultArray[i].schoolname
						}
					}
				}
			}

			return callback(null, courseArray);
		}
	});
}

courseManager.getCourseById = function (courseId, callback) {
	var sqlString = "SELECT " +
	"courses.name AS courseName, courses.identificationCode, " + // from courses table
	"majors.id AS majorId, majors.name AS majorName, " + // from majors table
	"departments.id AS departmentId, departments.name AS departmentName " + // from departments table
	"schools.id AS schoolId, schools.name AS schoolName " + // from schools table
	"FROM courses, majors, departments, schools WHERE courses.id = $1 AND courses.majorId = majors.id AND majors.departmentId = departments.id AND department.schoolId = schools.id";
	var inputVariables = [courseId];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			var row = result.row[0];
			if(!row) return callback(null, result);
			return callback(null, {
				id : courseId,
				name : row.coursename,
				identificationCode : row.identificationcode,
				major : {
					id : parseInt(row.majorid),
					name : row.majorname,
					department : {
						id : parseInt(row.departmentid),
						name : row.departmentname,
						school : {
							id : parseInt(row.schoolid),
							name : row.schoolname
						}
					}
				}
			});
		}
	});
}

courseManager.createCourse = function (name, identificationCode, majorId, callback) {
	var sqlString = "INSERT INTO courses (name, identificationCode, majorId) VALUES ($1, $2, $3)";
	var inputVariables = [name, identificationCode, majorId];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
}

module.exports = courseManager;