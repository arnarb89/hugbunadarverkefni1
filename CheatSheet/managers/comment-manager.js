'use strict';

var query = require('../DBController.js');



var commentManager = {};


commentManager.getCommentsByTypeAndParentId = function (type, parentId, callback) {
	var sqlString = "SELECT " +
	"comments.id as commentId, content, type, parentId, dateCreated, voteCount, dateModified, " + // from comments table
	"users.id as authordId, users.name as authorName, users.email as authorEmail " + // from users table
	"FROM comments, users WHERE comments.authorId = users.id AND type = $1 AND parentId = $2";
	var inputVariables = [type, parentId];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			var commentArray = result.row;
			for(var i in commentArray) {
				commentArray[i].commentid = parseInt(commentArray[i].commentid);
				commentArray[i].parentid = parseInt(commentArray[i].parentid);
				commentArray[i].datecreated = new Date(commentArray[i].datecreated);
				commentArray[i].votecount = parseInt(commentArray[i].voteCount);
				commentArray[i].datemodified = new Date(commentArray[i].datemodified);
				commentArray[i].author = {
					id : commentArray[i].authorid,
					name : commentArray[i].authorname,
					email : commentArray[i].authoremail
				};
				
				commentArray[i].authorid = undefined;
				commentArray[i].authorname = undefined;
				commentArray[i].authoremail = undefined;
			}
			return callback(null, commentArray);
		}
	});
}

commentManager.createComment = function (user, content, type, parentId, callback) {
	var sqlString = "INSERT INTO comments (author, content, type, parentId, dateCreated, voteCount, dateModified) VALUES ($1, $2, $3, $4, $5 $6, $7);";
	var inputVariables = [user.id, content, type, parentId, new Date(), 0, new Date()];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
}


module.exports = commentManager;