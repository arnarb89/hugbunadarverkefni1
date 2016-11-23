'use strict';

var dbc = require('../../cs-DBcontroller/cs-DBcontroller.js');



var courseManager = {};


courseManager.getCourseByMajorId = function (majorId, callback) {
	var sqlString = "SELECT " +
	"courses.id AS courseId, courses.name AS courseName, courses.identificationCode, " + // from courses table
	"majors.name AS majorName, " + // from majors tableaua
	"departments.id AS departmentId, departments.name AS departmentName, " + // from departments table
	"schools.id AS schoolId, schools.name AS schoolName " + // from schools table
	"FROM courses, majors, departments, schools WHERE majors.id = $1 AND courses.majorId = majors.id AND majors.departmentId = departments.id AND departments.schoolId = schools.id";
	var inputVariables = [majorId];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result.rows.map(formatCourse).map(course => { course.major.id = majorId; return course; }));
		}
	});
}



/*courseManager.getCoursesByMajorIdArnar = function (majorId, callback) {
	var sqlString = "SELECT " +
	"courses.id AS courseId, courses.name AS courseName, courses.identificationCode, " + // from courses table
	"majors.name AS majorName, majors.id AS majorId," + // from majors tableaua
	"departments.id AS departmentId, departments.name AS departmentName, " + // from departments table
	"schools.id AS schoolId, schools.name AS schoolName " + // from schools table
	"FROM courses, majors, departments, schools WHERE majors.id = $1 AND courses.majorId = majors.id AND majors.departmentId = departments.id AND departments.schoolId = schools.id;	";
	var inputVariables = [majorId];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err,null);
		} else {
			return callback(null,result);
		}
	});
}*/

courseManager.getCourseByIdArnar = function (courseId, callback) {
	var sqlString = "SELECT " +
	"courses.name AS courseName, courses.identificationCode, courses.id AS courseId, " + // from courses table
	"majors.id AS majorId, majors.name AS majorName, " + // from majors table
	"departments.id AS departmentId, departments.name AS departmentName, " + // from departments table
	"schools.id AS schoolId, schools.name AS schoolName " + // from schools table
	"FROM courses, majors, departments, schools WHERE courses.id = $1 AND courses.majorId = majors.id AND majors.departmentId = departments.id AND departments.schoolId = schools.id";
	var inputVariables = [courseId];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err,null);
		} else {
			return callback(null, result);
		}
	});
};

courseManager.getCourseById = function (courseId, callback) {
	var sqlString = "SELECT " +
	"courses.name AS courseName, courses.identificationCode, " + // from courses table
	"majors.id AS majorId, majors.name AS majorName, " + // from majors table
	"departments.id AS departmentId, departments.name AS departmentName, " + // from departments table
	"schools.id AS schoolId, schools.name AS schoolName " + // from schools table
	"FROM courses, majors, departments, schools WHERE courses.id = $1 AND courses.majorId = majors.id AND majors.departmentId = departments.id AND departments.schoolId = schools.id";
	var inputVariables = [courseId];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result.rows.map(formatCourse).map(course => { course.id = courseId; return course; })[0]);
		}
	});
}

courseManager.createCourse = function (name, identificationCode, majorId, callback) {
	var sqlString = "INSERT INTO courses (name, identificationCode, majorId) VALUES ($1, $2, $3) RETURNING *";
	var inputVariables = [name, identificationCode, majorId];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result.rows.map(formatCourse)[0]);
		}
	});
}


function formatCourse(unformattedCourse) {
	return {
		id : unformattedCourse.id ? unformattedCourse.id : unformattedCourse.courseid,
		name : unformattedCourse.name ? unformattedCourse.name : unformattedCourse.coursename,
		identificationCode : unformattedCourse.identificationcode ? unformattedCourse.identificationcode : unformattedCourse.courseidentificationcode,
		major : {
			id : unformattedCourse.majorid,
			name : unformattedCourse.majorname,
			department : {
				id : unformattedCourse.departmentid,
				name : unformattedCourse.departmentname,
				school : {
					id : unformattedCourse.schoolid,
					name : unformattedCourse.schoolname
				}
			}
		}
	};
};

module.exports = courseManager;