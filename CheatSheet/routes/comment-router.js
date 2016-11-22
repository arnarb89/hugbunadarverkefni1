'use strict';

var commentManager = require('../lib/managers/comment-manager');
var router = require('express').Router();

router.post('/async', function (req, res) {
	console.log(JSON.stringify(req.body));
	var parentId = req.body.parentId;
	var parentId = req.body.parentId;
	var type = req.body.commentType;
	var parentContentId = req.body.parenContentId
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
		commentManager.getCommentsByTypeAndParentId(type, parentId, parentContentId, function(err, result) {
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
	commentManager.getLatestComments(req.body.amount, function(err, result) {
		if(!err) {
			res.send(result);
		} else {
			res.send(err);
		}
	});
	}
});

module.exports = router;