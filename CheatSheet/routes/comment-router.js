'use strict';

var commentManager = require('../lib/managers/comment-manager');
var router = require('express').Router();
var isAuthenticated = require('../lib/isAuthenticated');

router.get('/async', function (req, res) {
	var parentId = req.body.parentId;
	var type = req.body.type;
	commentManager.getCommentsByTypeAndParentId(type, parentId, function callback(err, result) {
		if(!err) {
			res.send(result)
		} else {
			res.send(err)
		}
	});
});

router.get('/', function(req, res) {
	var parentId = req.body.parentId;
	var type = req.body.type;
	commentManager.getCommentsByTypeAndParentId(type, parentId, function callback(err, result) {
		if(!err) {
			res.render('comment', { title: 'Comments', comments:result});
		} else {
			res.render('comment', { title: 'Comments', summary:err});
		}
	});
});

router.post('/', isAuthenticated, function (req, res) {
	var content = req.body.content;
	var parentId = req.body.parentId;
	var type = req.body.type;
	commentManager.createComment(req.user, content, type, parentId, function callback(err, results) {
		if(!err) {
			res.send(result)
		} else {
			res.send(err)
		}
	});
});

module.exports = router;