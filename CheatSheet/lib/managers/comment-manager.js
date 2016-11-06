'use strict';

var query = require('../DBController.js');



var commentManager = {};


 // id, author, content, type, parentId, dateCreated, voteCount, dateModified

commentManager.getCommentsByTypeAndParentId = function (type, parentId, callback) {
	var sqlString = "SELECT " +
	"comments.id as commentId, content, type, parentId, dateCreated, voteCount, dateModified, " + // from comments table
	"users.id as authordId, users.name as authorName, users.email as authorEmail, users.username AS authorUsername " + // from users table
	"FROM comments, users WHERE comments.authorId = users.id AND type = $1 AND parentId = $2";
	var inputVariables = [type, parentId];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			var resultArray = result.row;
			var commentArray = [];

			for(var i in resultArray) {
				commentArray[i].commentId = parseInt(resultArray[i].commentid);
				commentArray[i].content = resultArray[i].content;
				commentArray[i].type = resultArray[i].type;
				commentArray[i].parentId = parseInt(resultArray[i].parentid);
				commentArray[i].dateCreated = new Date(resultArray[i].datecreated);
				commentArray[i].voteCount = parseInt(resultArray[i].voteCount);
				commentArray[i].dateModified = new Date(resultArray[i].datemodified);
				commentArray[i].author = {
					id : parseInt(resultArray[i].authorid),
					fullName : resultArray[i].authorfullNamename,
					email : resultArray[i].authoremail,
					username : resultArray[i].authorusername
				};
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