'use strict';

var query = require('../DBController.js');



var commentManager = {};


commentManager.getCommentsByTypeAndParentId = function (type, parentId, callback) {
	var sqlString = "SELECT * FROM comments WHERE type = $1 AND parentid = $2";
	var inputVariables = [type, parentId];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
}

commentManager.createComment = function (user, content, type, parentId, callback) {
	var sqlString = "INSERT INTO comments (userid, content, type, parentid) VALUES ($1, $2, $3, $4);";
	var inputVariables = [user.id, content, type, parentId];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
}


module.exports = commentManager;