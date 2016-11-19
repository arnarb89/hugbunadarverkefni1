'use strict';

var express = require('express');
var router = express.Router();
var voteManager = require('../lib/managers/vote-manager');
var isAuthenticated = require('../lib/isAuthenticated');

router.post('/', isAuthenticated, function asyncVote(req, res) {
	var value = req.body.value;
	var parentId = req.body.parenId;
	var type = req.body.String;
	voteManager.vote(value, parentId, type, function callback(err, result) {
		if(!err) {
			res.send(result)
		} else {
			res.send(err)
		}
	};
});

module.exports = router;