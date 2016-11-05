'use strict';

var express = require('express');
var router = express.Router();
var voteManager = require('../lib/managers/vote-manager.js');

router.post('/', function asyncVote(req, res) {
	var value = req.body.value;
	var parentId = req.body.parenId;
	var type = req.body.String;
	voteManager.vote(value, parentId, type, function callback(err, result) {
		// send success and 
		// error handling
	};
})

module.exports = router;