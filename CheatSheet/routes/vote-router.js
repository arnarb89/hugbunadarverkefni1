'use strict';

var express = require('express');
var router = express.Router();
var voteManager = require('../lib/managers/vote-manager');

module.exports = function(passport) {

	router.post('/',  function asyncVote(req, res) {
		var value = req.body.voteValue;
		var parentId = req.body.parentId;
		var type = req.body.type;
		var parentContentId = req.body.parentContentId;
		console.log(req.body);
		if(req.isAuthenticated()) {
			voteManager.applyCommentVote(req.user, value, parentId, type, function callback(err, result) {
				if(!err) {
					res.send(result)
				} else {
					res.send(err)
				}
			});
		} else {
			res.status(401).send();
		}
	});

	return router;
}

