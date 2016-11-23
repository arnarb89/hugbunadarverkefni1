'use strict';

var dbc = require('../../cs-DBcontroller/cs-DBcontroller.js');



var voteManager = {};


voteManager.applyCommentVote = function (user, value, commentId, parentContentType, callback) {
	var sqlString;
	var inputVariables = [user.id, value, commentId, parentContentType];

	if(parentContentType.toLowerCase() === "course") {
		sqlString = "INSERT INTO commentVotes (userId, value, parentId, type) VALUES ($1, $2, $3, $4) RETURNING *;";
	} else if (parentContentType.toLowerCase() === "summary") {
		sqlString = "INSERT INTO commentVotes (userId, value, parentId, type) VALUES ($1, $2, $3, $4) RETURNING *;";
	}

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			if(!result.rows[0]) return callback(null, [{ user : user, parentId : commentId, type : parentContentType }]); // shitty fix, because if the vote gets updated instead of inserted (upsert trigger in db) it returns nothing
			return callback(null, result.rows.map(formatVote).map(vote => { vote.user = user; return vote; }));
		}
	}); 

}

voteManager.applySummaryVote = function(user, value, summaryId, callback) {
	var sqlString = "INSERT INTO summaryVotes (userId, value, parentId) VALUES ($1, $2, $3) RETURNING *";
	var inputVariables = [user.id, value, summaryId];

	dbc.query(sqlString, inputVariables, function(err, result) {
		if(err) {
			return callback(err);
		} else {
			if(!result.rows[0]) return callback(null, [{ user : user, parentId : summaryId }]); // shitty fix, because if the vote gets updated instead of inserted (upsert trigger in db) it returns nothing
			return callback(null, result.rows.map(formatVote).map(vote => { vote.user = user; return vote; }));
		}
	});
}

function formatVote(unformattedVote) {
	var vote = {
		user : {
			id : unformattedVote.userid,
			fullName : unformattedVote.fullname,
			email : unformattedVote.email,
			username : unformattedVote.username
		},
		value : unformattedVote.value,
		parentId : unformattedVote.parentid
	};
	if(unformattedVote.type !== undefined) vote.type = unformattedVote.type;

	return vote;
};



module.exports = voteManager;