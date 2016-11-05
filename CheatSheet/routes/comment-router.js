'use strict';

var express = require('express');
var commentManager = require('../lib/managers/comment-manager.js');
var router = express.Router();

router.get('/async', function(req, res) ) {
	var parentId = req.body.parentId;
	var type = req.body.type;
	commentManager.getCommentsByTypeAndParentId(type, parentId, function callback(err, result) {

	};
}

router.get('/', function(req, res) ) {
	var parentId = req.body.parentId;
	var type = req.body.type;
	commentManager.getCommentsByTypeAndParentId(type, parentId, function callback(err, result) {

	};
}

router.post('/', function (req, res) {
	var content = req.body.content;
	var parentId = req.body.parentId;
	var type = req.body.type;
	commentManager.createComment(req.user, content, type, parentId, function callback(err, results) {

	};
})

module.exports = router;