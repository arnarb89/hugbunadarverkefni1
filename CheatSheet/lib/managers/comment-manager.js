'use strict';

var query = require('../DBController.js');
var moment = require('moment');



var commentManager = {};


 // id, author, content, type, parentId, dateCreated, voteCount, dateModified

commentManager.getCommentsWithVoteByTypeAndParentId = function (user, type, parentId, parentContentId, callback) {
	var commentTable, parentContentTable;
	if(type.toLowerCase() === "course") { commentTable = "courseComments"; parentContentTable = "courses"; };
	else if (type.toLowerCase === "summary") { commentTable = "summaryComments"; parentContentTable = "summaries"; };

	var sqlString = "SELECT " +
	"$1.id as commentId, content, $1.parentId, dateCreated, voteCount, dateModified, " + // from comments table
	"users.id as authordId, users.fullname as authorName, users.email as authorEmail, " + // from users table
	"userLocal.username AS authorUsername, " + // from userLocal table
	"CASE WHEN commentVotes.userId=$3 THEN commentVotes.value ELSE 0 END AS voteValue " + // from commentVotes table
	"FROM $1, users, userLocal, commentVotes, $4"
	"WHERE $1.authorId = users.id AND $1.parentId = $2 AND users.id = userLocal.userId AND commentvotes.parentid = $1.id AND $4.id = $1.parentContentId;";
	var inputVariables = [commentTable, parentId, user.id, parentContentTable];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			var resultArray = result.rows;
			var commentArray = [];

			for(var i in resultArray) {
				commentArray[i].id = parseInt(resultArray[i].commentid);
				commentArray[i].content = resultArray[i].content;
				commentArray[i].parentId = parseInt(resultArray[i].parentid);
				commentArray[i].dateCreated = moment(resultArray[i].datecreated);
				commentArray[i].voteCount = parseInt(resultArray[i].voteCount);
				commentArray[i].dateModified = moment(resultArray[i].datemodified);
				commentArray[i].voteValue = resultArray[i].votevalue;
				commentArray[i].author = {
					id : parseInt(resultArray[i].authorid),
					fullName : resultArray[i].authorname,
					email : resultArray[i].authoremail,
					username : resultArray[i].authorusername
				};
			}
			return callback(null, commentArray);
		}
	});
};

commentManager.getCommentsByTypeAndParentId = function (type, parentId, callback) {
	var commentTable;
	if(type.toLowerCase() === "course") commentTable = "courseComments";
	else if (type.toLowerCase === "summary") commentTable = "summaryComments";

	var sqlString = "SELECT " +
	"$1.id as commentId, content, parentId, dateCreated, voteCount, dateModified, " + // from comments table
	"users.id as authordId, users.fullname as authorName, users.email as authorEmail, " + // from users table
	"usersLocal.username AS authorUsername " + // from userLocal table
	"FROM $1, users, userLocal, $3 "
	"WHERE $1.authorId = users.id AND parentId = $2 AND users.id = userLocal.userId AND $3.id = $1.parentContentId;";
	var inputVariables = [commentTable, parentId, parentContentId];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			var resultArray = result.rows;
			var commentArray = [];

			for(var i in resultArray) {
				commentArray[i].id = parseInt(resultArray[i].commentid);
				commentArray[i].content = resultArray[i].content;
				commentArray[i].parentId = parseInt(resultArray[i].parentid);
				commentArray[i].dateCreated = moment(resultArray[i].datecreated);
				commentArray[i].voteCount = parseInt(resultArray[i].voteCount);
				commentArray[i].dateModified = moment(resultArray[i].datemodified);
				commentArray[i].author = {
					id : parseInt(resultArray[i].authorid),
					fullName : resultArray[i].authorname,
					email : resultArray[i].authoremail,
					username : resultArray[i].authorusername
				};
			}
			return callback(null, commentArray);
		}
	});
};

commentManager.createComment = function (user, content, type, parentId, parentContentId, callback) {
	var commentTable, parentContentTable;
	if(type.toLowerCase() === "course") { commentTable = "courseComments"; parentContentTable = "courses"; };
	else if (type.toLowerCase === "summary") { commentTable = "summaryComments"; parentContentTable = "summaries"; };

	var sqlString = "INSERT INTO $1 (authorId, content, parentId, dateCreated, voteCount, dateModified, parentContentId) VALUES ($2, $3, $4, $5 $6, $7, $8);";
	var inputVariables = [commentTable, user.id, content, parentId, moment(), 0, moment(), parentContentId];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
};


commentManager.editCommentByIdAndType = function (commentId, type, content, callback) {
	var commentTable;
	if(type.toLowerCase() === "course") commentTable = "courseComments";
	else if (type.toLowerCase === "summary") commentTable = "summaryComments";

	var sqlString = "UPDTATE $1 SET content = $3 WHERE id = $2;";
	var inputVariables = [commentTable, commentId, content];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
};

module.exports = commentManager;