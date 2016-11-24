'use strict';

var commentManager = require('../lib/managers/comment-manager');
var express = require('express');
var router = express.Router();

module.exports = function(passport) {

	router.post('/async', function (req, res) {
		var parentId = req.body.parentId;
		var type = req.body.type;
		var parentContentId = req.body.parentContentId
		console.log(JSON.stringify(req.body));
		if(req.isAuthenticated()){
			commentManager.getCommentsWithVoteByTypeAndParentId(req.user, 
				type, parentId, parentContentId, function(err, result) {
				if(!err) {
					res.send(result);
				} else {
					res.send(err);
				}
			});
		} else {
			console.log('/async not signed in')
			commentManager.getCommentsByTypeAndParentId(type, parentId, parentContentId, function(err, result) {
				console.log('err:')
				console.log(JSON.stringify(err))
				console.log('result:')
				console.log(JSON.stringify(result))
				if(!err) {
					res.send(result);
				} else {
					res.send(err);
				}
			});
		}
	});

	router.post('/async/create', function (req, res) {
		var content = req.body.content;
		var parentId = req.body.parent_id;
		var type = req.body.comment_type;
		var parentContentId = req.body.parent_content_id;
		var isEdit = req.body.is_edit;
		console.log(req.body)
		if(req.isAuthenticated()) {
			if(isEdit) {
				commentManager.editCommentByIdAndType(req.user, 
					content, type, commentId, parentContentId, function(err, result) {
					if(!err) {
						res.send(result);
					} else {
						res.send(err);
					}
				});
			} else {
				commentManager.createComment(req.user,
				 content, type, parentId, parentContentId, function(err, result) {
					if(!err) {
						res.send(result);
					} else {
						res.send(err);
					}
				});
			}
		} else {
			res.status(401).send();
		}
	});

	router.post('/async/latest', function (req, res) {
		console.log(req.body)
		commentManager.getLatestComments(req.body.amount, function(err, result) {
			if(!err) {
				res.send(result);
			} else {
				res.send(err);
			}
		});
	});

	return router;
};