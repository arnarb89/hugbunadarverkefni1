'use strict';

var query = require('../DBController.js');



var summaryManager = {};


summaryManager.getSummaryById = function (summaryId, callback) {
	var sqlString = "SELECT " +
	"summaries.content, summaries.teacherName, summaries.attendanceDate, summaries.voteCount, summaries.dateCreated. summaries.dateModified, " + // from summaries table
	"courses.name AS courseName, courses.identificationCode AS courseIdentificationCode, " + // from course table
	"majors.id AS majorId, majors.name AS majorName, " + // from major table
	"departments.id AS departmentId, departments.name AS departmentName, " + // from department table
	"schools.id AS schoolId, schools.name AS schoolName, " + // from school table
	"users.id AS authorId, users.fullname AS authorName, users.email AS authorEmail, users.username AS authorUsername " + // from user table
	"FROM summaries, courses, majors, departments, schools, users " +
	"WHERE summaries.courseid =  summaries.id = $1 AND courses.id AND courses.majorid = majors.id AND majors.departmentid = departments.id AND departments.schoolid = schools.id AND summaries.authorid = users.id";
	var inputVariables = [summaryId];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			var row = result.row;
			if(!row) return callback(null, result);
			return callback(null, {
				id : summaryId,
				teacherName : row.teachername,
				attendanceDate : new Date(row.attendancedate),
				voteCount : parseInt(row.votecount),
				dateCreated : new Date(row.datecreated),
				dateModified : new Date(row.datemodified),
				author : {
					id : parseInt(resultArray[i].authorid),
					fullname : resultArray[i].authorname,
					email : resultArray[i].authoremail,
					username : resultArray[i].authorusername
				}
				course = {
					id : parseInt(row.courseid),
					name : resultArray[i].coursename,
					identificationCode : courseidentificationcode,
					major : {
						id : parseInt(resultArray[i].majorid),
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
			});
		}
	});
}


// id, author, content, teacherName, attendanceDate, course, voteCount, dateCreated, dateModified


summaryManager.getSummaryByCourse = function (courseId, callback) {
	var sqlString = "SELECT " +
	"summaries.id AS summaryId, summaries.content, summaries.teacherName, summaries.attendanceDate, summaries.voteCount, summaries.dateCreated. summaries.dateModified, " + // from summary table
	"courses.name AS courseName, courses.identificationCode AS courseIdentificationCode, " + // from course table
	"majors.id AS majorId, majors.name AS majorName, " + // from major table
	"departments.id AS departmentId, departments.name AS departmentName, " + // from department table
	"schools.id AS schoolId, schools.name AS schoolName, " + // from school table
	"users.id AS authorId, users.fullname AS authorName, users.email AS authorEmail, users.username AS authorUsername " + // from user table
	"FROM summaries, courses, majors, departments, schools, users " +
	"WHERE summaries.courseid =  summaries.courseId = $1 AND courses.id AND courses.majorid = majors.id AND majors.departmentid = departments.id AND departments.schoolid = schools.id AND summaries.authorid = users.id";
	var inputVariables = [courseId];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			var resultArray = result.row;
			var summaryArray = [];

			// converting the result to hierarchy of objects, converting to correct types and leaving behind unnecessary variables
			for(var i in resultArray) {
				summaryArray[i].id = parseInt(resultArray[i].summaryid);
				summaryArray[i].teacherName = resultArray[i].teachername;
				summaryArray[i].attendanceDate = new Date(resultArray[i].attendancedate);
				summaryArray[i].voteCount = parseInt(resultArray[i].votecount);
				summaryArray[i].dateCreated = new Date(resultArray[i].datecreated);
				summaryArray[i].dateModified = new Date(resultArray[i].datemodified);
				summaryArray[i].author = {
					id : parseInt(resultArray[i].authorid),
					fullname : resultArray[i].authorname,
					email : resultArray[i].authoremail,
					username : resultArray[i].authorusername
				};
				summaryArray[i].course = {
					id : courseId,
					name : resultArray[i].coursename,
					identificationCode : courseidentificationcode,
					major : {
						id : parseInt(resultArray[i].majorid),
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
			}

			return callback(null, summaryArray);
		}
	});
}

summaryManager.getSummaryMetaData = function (courseId, callback) {
	var sqlString = "SELECT " +
	"summaries.id AS summaryId, summaries.teacherName, summaries.attendanceDate, summaries.voteCount, summaries.dateCreated. summaries.dateModified, " + // from summary table
	"users.id AS authorId, users.fullname AS authorName, users.email AS authorEmail, users.username AS authorUsername " + // from user table
	"FROM summaries, courses, users WHERE summaries.authorid = users.id AND summaries.courseId = $1";
	var inputVariables = [courseId];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			var resultArray = result.row;
			var summaryMetaDataArray = [];

			// converting the result to hierarchy of objects, converting to correct types and leaving behind unnecessary variables
			for(var i in resultArray) {
				summaryMetaDataArray[i].id = parseInt(resultArray[i].summaryid);
				summaryMetaDataArray[i].teacherName = resultArray[i].teachername;
				summaryMetaDataArray[i].attendanceDate = new Date(resultArray[i].attendancedate);
				summaryMetaDataArray[i].voteCount = parseInt(resultArray[i].votecount);
				summaryMetaDataArray[i].dateCreated = new Date(resultArray[i].datecreated);
				summaryMetaDataArray[i].dateModified = new Date(resultArray[i].datemodified);
				summaryMetaDataArray[i].courseId = coursId;
				summaryMetaDataArray[i].author = {
					id : parseInt(resultArray[i].authorid),
					fullname : resultArray[i].authorname,
					email : resultArray[i].authoremail,
					username : resultArray[i].authorusername
				};
			}

			return callback(null, summaryMetaDataArray);
		}
	});
}

summaryManager.createSummary = function (user, content, teacherName, attendanceDate, courseId, callback) {
	var sqlString = "INSERT INTO summaries (author, content, teacherName, attendanceDate, courseId, voteCount, dateCreated, dateModified) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
	var inputVariables = [user.id, content, teacherName, attendanceDate, courseId, 0, new Date(), new Date()];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
}

module.exports = summaryManager;