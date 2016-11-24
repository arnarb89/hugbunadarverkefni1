'use strict';

var dbc = require('../../cs-DBcontroller/cs-DBcontroller.js');
var moment = require('moment');



var commentManager = {};

commentManager.getLatestComments = function (amount, callback) {
	// var sqlString = "SELECT " +
	// "comments.id, content, parentId, dateCreated, voteCount, dateModified, " + // from comments (summaryComments UNION courseComments)
	// "fullName as authorName, email as authorEmail, " + // from users
	// "users.id as authorId, username as authorUsername " + // from userLocal
	// "FROM (SELECT * FROM courseComments UNION SELECT * FROM summaryComments LIMIT $1) AS comments, users, userLocal " +
	// "WHERE comments.authorid = users.id " +
	// "AND users.id = userLocal.userId; " 
	// "ORDER BY dateModified DESC;";

	var sqlString = "SELECT " +
	"comments.id, content, parentId, dateCreated, voteCount, dateModified, " + // from comments (summaryComments UNION courseComments)
	"users.id AS authorId, fullName AS authorName, email AS authorEmail, " + // from users
	"CASE WHEN users.id=us.userId THEN (SELECT username FROM userLocal WHERE userLocal.userId=users.id) END AS authorUsername " + // from userLocal
	"FROM (SELECT * FROM courseComments UNION SELECT * FROM summaryComments LIMIT $1) AS comments, users, (SELECT userLocal.userId FROM userLocal UNION SELECT userFb.userId FROM userFb) as us " +
	"WHERE comments.authorid = users.id " +
	"AND users.id = us.userId; " 
	"ORDER BY dateModified DESC;";

	var inputVariables = [amount];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result.rows.map(formatComment));
		}
	});
}

commentManager.getCommentsWithVoteByTypeAndParentId = function (user, type, parentId, parentContentId, callback) {
	var sqlString;
	var inputVariables = [user.id, parentId, parentContentId, type];

	if(type.toLowerCase() === "course") {
		// sqlString = "SELECT " +
		// 	"courseComments.id as commentId, courseComments.content, courseComments.parentId, courseComments.dateCreated, courseComments.voteCount, courseComments.dateModified, parentContentId, " + // from comments table
		// 	"users.id as authorId, users.fullname as authorName, users.email as authorEmail, " + // from users table
		// 	"userLocal.username AS authorUsername, " + // from userLocal table
		// 	"(SELECT coalesce(max(value), 0) FROM commentvotes WHERE userId=$1 AND parentId=courseComments.id AND type=$4) AS voteValue, " + // checking if the current user has voted on the comment
		// 	"CASE WHEN courseComments.id IN (SELECT courseComments.parentId FROM courseComments) THEN 1 ELSE 0 END AS hasChild " + // checking if the comment has subComments
		// 	"FROM courseComments, courses, users, userLocal " +
		// 	"WHERE courseComments.authorId = users.id " + // comment.authorId = users.id
		// 	"AND courseComments.parentId = $2 " + // comment.parentId = parentId (given parameter)
		// 	"AND courseComments.parentContentId = $3 " + // comment.parentContentId = parentContentId (given parameter)
		// 	"AND courseComments.parentContentId = courses.id " + // comment.parentContentId = parentContentTable.id
		// 	"AND users.id = userLocal.userId;";


		sqlString = "SELECT " +
			"courseComments.id as commentId, courseComments.content, courseComments.parentId, courseComments.dateCreated, courseComments.voteCount, courseComments.dateModified, parentContentId, " + // from comments table
			"users.id as authorId, users.fullname as authorName, users.email as authorEmail, " + // from users table
			"CASE WHEN users.id=us.userId THEN (SELECT username FROM userLocal WHERE userLocal.userId=users.id) END AS authorUsername, " + // from userLocal table
			"(SELECT coalesce(max(value), 0) FROM commentvotes WHERE userId=$1 AND parentId=courseComments.id AND type=$4) AS voteValue, " + // checking if the current user has voted on the comment
			"CASE WHEN courseComments.id IN (SELECT courseComments.parentId FROM courseComments) THEN 1 ELSE 0 END AS hasChild " + // checking if the comment has subComments
			"FROM courseComments, courses, users, (SELECT userLocal.userId FROM userLocal UNION SELECT userFb.userId FROM userFb) as us " +
			"WHERE courseComments.authorId = users.id " + // comment.authorId = users.id
			"AND courseComments.parentId = $2 " + // comment.parentId = parentId (given parameter)
			"AND courseComments.parentContentId = $3 " + // comment.parentContentId = parentContentId (given parameter)
			"AND courseComments.parentContentId = courses.id " + // comment.parentContentId = parentContentTable.id
			"AND users.id = us.userId;";


			
	} else if (type.toLowerCase() === "summary") {
		// sqlString = "SELECT " +
		// 	"summaryComments.id as commentId, summaryComments.content, summaryComments.parentId, summaryComments.dateCreated, summaryComments.voteCount, summaryComments.dateModified, parentContentId, " + // from comments table
		// 	"users.id as authorId, users.fullname as authorName, users.email as authorEmail, " + // from users table
		// 	"userLocal.username AS authorUsername, " + // from userLocal table
		// 	"(SELECT coalesce(max(value), 0) FROM commentvotes WHERE userId=$1 AND parentId=summaryComments.id AND type=$4) AS voteValue, " + // checking if the current user has voted on the comment
		// 	"CASE WHEN summaryComments.id IN (SELECT summaryComments.parentId FROM summaryComments) THEN 1 ELSE 0 END AS hasChild " + // checking if the comment has subComments
		// 	"FROM summaryComments, summaries, users, userLocal " +
		// 	"WHERE summaryComments.authorId = users.id " + // comment.authorId = users.id
		// 	"AND summaryComments.parentId = $2 " + // comment.parentId = parentId (given parameter)
		// 	"AND summaryComments.parentContentId = $3 " + // comment.parentContentId = parentContentId (given parameter)
		// 	"AND summaryComments.parentContentId = summaries.id " + // comment.parentContentId = parentContentTable.id
		// 	"AND users.id = userLocal.userId;";


		sqlString = "SELECT " +
			"summaryComments.id as commentId, summaryComments.content, summaryComments.parentId, summaryComments.dateCreated, summaryComments.voteCount, summaryComments.dateModified, parentContentId, " + // from comments table
			"users.id as authorId, users.fullname as authorName, users.email as authorEmail, " + // from users table
			"CASE WHEN users.id=us.userId THEN (SELECT username FROM userLocal WHERE userLocal.userId=users.id) END AS authorUsername, " + // from userLocal table
			"(SELECT coalesce(max(value), 0) FROM commentvotes WHERE userId=$1 AND parentId=summaryComments.id AND type=$4) AS voteValue, " + // checking if the current user has voted on the comment
			"CASE WHEN summaryComments.id IN (SELECT summaryComments.parentId FROM summaryComments) THEN 1 ELSE 0 END AS hasChild " + // checking if the comment has subComments
			"FROM summaryComments, summaries, users, (SELECT userLocal.userId FROM userLocal UNION SELECT userFb.userId FROM userFb) as us " +
			"WHERE summaryComments.authorId = users.id " + // comment.authorId = users.id
			"AND summaryComments.parentId = $2 " + // comment.parentId = parentId (given parameter)
			"AND summaryComments.parentContentId = $3 " + // comment.parentContentId = parentContentId (given parameter)
			"AND summaryComments.parentContentId = summaries.id " + // comment.parentContentId = parentContentTable.id
			"AND users.id = us.userId;";

	}

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result.rows.map(formatComment));
		}
	});
};


commentManager.getCommentsByTypeAndParentId = function (type, parentId, parentContentId, callback) {
	var sqlString;
	var inputVariables = [parentId, parentContentId];
	if(type.toLowerCase() === "course") {
		sqlString = "SELECT " +
			"courseComments.id as commentId, courseComments.content, courseComments.parentId, courseComments.dateCreated, courseComments.voteCount, courseComments.dateModified, parentContentId, " + // from comments table
			"users.id as authorId, users.fullname as authorName, users.email as authorEmail, " + // from users table
			"CASE WHEN users.id=us.userId THEN (SELECT username FROM userLocal WHERE userLocal.userId=users.id) END AS authorUsername, " + // from userLocal table
			"CASE WHEN courseComments.id IN (SELECT courseComments.parentId FROM courseComments) THEN 1 ELSE 0 END AS hasChild " + // checking if the comment has subComments
			"FROM courseComments, courses, users, (SELECT userLocal.userId FROM userLocal UNION SELECT userFb.userId FROM userFb) as us " +
			"WHERE courseComments.authorId = users.id " + // comment.authorId = users.id
			"AND courseComments.parentId = $1 " + // comment.parentId = parentId (given parameter)
			"AND courseComments.parentContentId = $2 " + // comment.parentContentId = parentContentId (given parameter)
			"AND courseComments.parentContentId = courses.id " + // comment.parentContentId = parentContentTable.id +
			"AND users.id = us.userId; ";

	} else if (type.toLowerCase() === "summary") {
		// sqlString = "SELECT " +
		// 	"summaryComments.id as commentId, summaryComments.content, summaryComments.parentId, summaryComments.dateCreated, summaryComments.voteCount, summaryComments.dateModified, parentContentId, " + // from comments table
		// 	"users.id as authorId, users.fullname as authorName, users.email as authorEmail, " + // from users table
		// 	"CASE WHEN users.id=us.userId THEN (SELECT username FROM userLocal WHERE userLocal.userId=users.id) END AS authorUsername, " + // from userLocal table
		// 	"CASE WHEN summaryComments.id IN (SELECT summaryComments.parentId FROM summaryComments) THEN 1 ELSE 0 END AS hasChild " + // checking if the comment has subComments
		// 	"FROM summaryComments, courses, users, (SELECT userLocal.userId FROM userLocal UNION SELECT userFb.userId FROM userFb) as us " +
		// 	"WHERE summaryComments.authorId = users.id " + // comment.authorId = users.id
		// 	"AND summaryComments.parentId = $1 " + // comment.parentId = parentId (given parameter)
		// 	"AND summaryComments.parentContentId = $2 " + // comment.parentContentId = parentContentId (given parameter)
		// 	"AND summaryComments.parentContentId = summaries.id " + // comment.parentContentId = parentContentTable.id
		// 	"AND users.id = us.userId;";

		sqlString = "SELECT " +
			"summaryComments.id as commentId, summaryComments.content, summaryComments.parentId, summaryComments.dateCreated, summaryComments.voteCount, summaryComments.dateModified, parentContentId, " +
			"users.id as authorId, users.fullname as authorName, users.email as authorEmail, " +
			"CASE WHEN users.id=us.userId THEN (SELECT username FROM userLocal WHERE userLocal.userId=users.id) END AS authorUsername, " +
			"CASE WHEN summaryComments.id IN (SELECT summaryComments.parentId FROM summaryComments) THEN 1 ELSE 0 END AS hasChild " +
			"FROM summaryComments, summaries, users, (SELECT userLocal.userId FROM userLocal UNION SELECT userFb.userId FROM userFb) as us " +
			"WHERE summaryComments.authorId = users.id " +
			"AND summaryComments.parentId = $1 " +
			"AND summaryComments.parentContentId = $2 " +
			"AND summaryComments.parentContentId = summaries.id " +
			"AND users.id = us.userId; ";
	}

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result.rows.map(formatComment));			
		}
	});
};

commentManager.createComment = function (user, content, type, parentId, parentContentId, callback) {
	var sqlString;
	var inputVariables = [user.id, content, parentId, moment().format(), 0, moment().format(), parentContentId];

	if(type.toLowerCase() === "course") {
		sqlString = "INSERT INTO courseComments (authorId, content, parentId, dateCreated, voteCount, dateModified, parentContentId) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;";
	} else if (type.toLowerCase() === "summary") {
		sqlString = "INSERT INTO summaryComments (authorId, content, parentId, dateCreated, voteCount, dateModified, parentContentId) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;";
	}

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {

			return callback(null, result.rows.map(formatComment).map(comment => { comment.author=user; return comment } ));
		}
	});
};

commentManager.editCommentByIdAndType = function (user, content, type, commentId, callback) {
	var sqlString = "UPDATE $1 SET content = $3, datemModified = $4 WHERE id = $2 AND authorId = $5;";
	var inputVariables = [user.id, content, commentId, moment().format()];

	if(type.toLowerCase() === "course") {
		sqlString = "UPDATE courseComments SET content = $2, dateModified = $4 WHERE authorId = $1 AND id = $3 RETURNING *;";
	} else if (type.toLowerCase() === "summary") {
		sqlString = "UPDATE summaryComments SET content = $2, dateModified = $4 WHERE authorId = $1 AND id = $3 RETURNING *;";
	}

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result.rows.map(formatComment).map(comment => { comment.author=user; return comment } ));
		}
	});
};

function formatComment(unformattedComment) {
	var comment = {
		id : unformattedComment.id !== undefined ? unformattedComment.id : unformattedComment.commentid,
		content : unformattedComment.content,
		parentId : unformattedComment.parentid,
		parentContentId : unformattedComment.parentcontentid,
		voteCount : unformattedComment.votecount,
		dateCreated : moment(unformattedComment.datecreated).fromNow(),
		dateModified : moment(unformattedComment.datemodified).fromNow(),
		hasChild : Boolean(unformattedComment.haschild),
		author : {
			id : unformattedComment.authorid,
			// fullName : unformattedComment.authorname,
			username : unformattedComment.authorname,
			email : unformattedComment.authoremail,
			// username : unformattedComment.authorusername
			fullName : unformattedComment.authorusername
		}
	};
	if(unformattedComment.votevalue !== undefined) comment.voteValue = unformattedComment.votevalue; // only some comments should have the voteValue attribute
	return comment;
};

module.exports = commentManager;