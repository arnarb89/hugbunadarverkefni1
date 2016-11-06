'use strict';

var query = require('../DBController.js');



var voteManager = {};

voteManager.applyVote = function (user, value, parentId, type, callback) {
	var sqlString = "INSERT INTO votes (userId, value, parentId, type) VALUES ($1, $2, $3, $4);";
	var inputVariables = [user.id, value, parentId, type];

	query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, result);
		}
	});
}



module.exports = voteManager;