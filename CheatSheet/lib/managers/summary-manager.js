'use strict';

var dbc = require('../../cs-DBcontroller/cs-DBcontroller.js');
var moment = require('moment');



var summaryManager = {};


summaryManager.getSummaryById = function (summaryId, callback) {
	var sqlString = "SELECT " +
	"summaries.content, summaries.teacherName, summaries.attendanceDate, summaries.voteCount, summaries.dateCreated, summaries.dateModified, " + // from summaries table
	"courses.id AS courseId, courses.name AS courseName, courses.identificationCode AS courseIdentificationCode, " + // from course table
	"majors.id AS majorId, majors.name AS majorName, " + // from major table
	"departments.id AS departmentId, departments.name AS departmentName, " + // from department table
	"schools.id AS schoolId, schools.name AS schoolName, " + // from school table
	"users.id AS authorId, users.fullName AS authorName, users.email AS authorEmail, " + // from user table
	"userLocal.username AS authorUsername " + // from userLocal table
	"FROM summaries, courses, majors, departments, schools, users, userLocal " +
	"WHERE summaries.id = $1 AND summaries.courseid = courses.id AND courses.majorid = majors.id AND majors.departmentid = departments.id AND departments.schoolid = schools.id AND summaries.authorid = users.id AND users.id=userLocal.userId";
	var inputVariables = [summaryId];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result.rows.map(formatSummary).map(summary => { summary.id = summaryId; return summary; })[0]);
		}
	});
}




summaryManager.getSummaryByCourse = function (courseId, callback) {
	var sqlString = "SELECT " +
	"summaries.id AS summaryId, summaries.content, summaries.teacherName, summaries.attendanceDate, summaries.voteCount, summaries.dateCreated, summaries.dateModified, " + // from summary table
	"courses.name AS courseName, courses.identificationCode AS courseIdentificationCode, " + // from course table
	"majors.id AS majorId, majors.name AS majorName, " + // from major table
	"departments.id AS departmentId, departments.name AS departmentName, " + // from department table
	"schools.id AS schoolId, schools.name AS schoolName, " + // from school table
	"users.id AS authorId, users.fullName AS authorName, users.email AS authorEmail, " + // from user table
	"userLocal.username AS authorUsername " + // from userLocal table
	"FROM summaries, courses, majors, departments, schools, users, userLocal " +
	"WHERE summaries.courseId = $1 AND summaries.courseId = courses.id AND courses.majorId = majors.id AND majors.departmentId = departments.id AND departments.schoolId = schools.id AND summaries.authorId = users.id AND users.id=userLocal.userId";
	var inputVariables = [courseId];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result.rows.map(formatSummary).map(summary => { summary.course.id = courseId; return summary; }));
		}
	});
}


summaryManager.getSummaryMetaData = function (courseId, callback) {
	var sqlString = "SELECT " +
	"summaries.id AS summaryId, summaries.teacherName, summaries.attendanceDate, summaries.voteCount, summaries.dateCreated, summaries.dateModified, " + // from summary table
	"users.id AS authorId, users.fullName AS authorName, users.email AS authorEmail, " + // from user table
	"userLocal.username AS authorUsername " + // from userLocal table
	"FROM summaries, courses, users, userLocal "+
	"WHERE summaries.authorid = users.id AND summaries.courseId = $1 AND users.id=userLocal.userId AND courses.id=$1"+
	"ORDER BY summaries.voteCount DESC;";
	var inputVariables = [courseId];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result.rows.map(formatSummary).map(summary => { summary.courseId = courseId; return summary; }));
		}
	});
}

summaryManager.createSummary = function (user, content, teacherName, attendanceDate, courseId, callback) {
	var sqlString = "INSERT INTO summaries (authorId, content, teacherName, attendanceDate, courseId, voteCount, dateCreated, dateModified) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
	var inputVariables = [user.id, content, teacherName, attendanceDate, courseId, 0, moment().format(), moment().format()];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result.rows.map(formatSummary).map(summary => { summary.author = user; return summary; })[0]);
		}
	});
}

function formatSummary(unformattedSummary) {
	var summary = {
		id : unformattedSummary.id !== undefined ? unformattedSummary.id : unformattedSummary.summaryid,
		teacherName : unformattedSummary.teachername,
		attendanceDate : moment(unformattedSummary.attendancedate).format('hh:mm DD/MM/YY'),
		dateCreated : moment(unformattedSummary.datecreated).format('hh:mm DD/MM/YY'),
		dateModified : moment(unformattedSummary.datemodified).format('hh:mm DD/MM/YY'),
		voteCount : unformattedSummary.votecount,
		author : {
			id : unformattedSummary.authorid,
			fullName : unformattedSummary.authorname,
			email : unformattedSummary.authoremail,
			username : unformattedSummary.authorusername
		},
	};

	if(unformattedSummary.content) summary.content = unformattedSummary.content;

	if(unformattedSummary.courseid || unformattedSummary.coursename) {
		summary.course = {
			id : unformattedSummary.courseid,
			name : unformattedSummary.coursename,
			identificationCode : unformattedSummary.courseidentificationcode,
			major : {
				id : unformattedSummary.majorid,
				name : unformattedSummary.majorname,
				department : {
					id : unformattedSummary.departmentid,
					name : unformattedSummary.departmentname,
					school : {
						id : unformattedSummary.schoolid,
						name : unformattedSummary.schoolname
					}
				}
			}
			
		}
	};

	return summary;
};

module.exports = summaryManager;