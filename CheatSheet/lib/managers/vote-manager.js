'use strict';

var query = require('../DBController.js');



var voteManager = {};

voteManager.applyVote = function (user, value, parentId, type, callback) {
	var voteTable;
	if(type.toLowerCase() === "comment") voteTable = "commentVotes";
	else if (type.toLowerCase === "summary") voteTable = "summaryVotes";

	var sqlString = "INSERT INTO $1 (userId, value, parentId, type) VALUES ($2, $3, $4);";
	var inputVariables = [voteTable, user.id, value, parentId];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
}



module.exports = voteManager;