(function() {

	var commentTemplate;
	var mainContainer;
	var commentType;
	var replyTemplate;
	var editTemplate;
	var thisUser;
	var thisContent;

	var init = function() {
		// $('#comment-load-button').click(function(){
		// 	getComments(0);
		// });
		mainContainer = $('#comment-main-container');
		commentTemplate = $('#comment-container-template');
		replyTemplate = $('#reply-box-template');
		editTemplate = $('#edit-box-template');
		commentType = commentTemplate.data('commenttype');
		console.log(user);
		console.log(contentData);
		thisUser = user;
		thisContent = contentData;
		getComments(0);
	};

	var getComments = function(parentId) {
		console.log('getComments()');
		$.ajax({
			type: 'GET',
			url: '/comment/async',
			data: {
				parentId:parentId,
				type: thisContent.type,
				parentContentId: thisContent.id
			},
			success: function(result) {
				console.log('ajax:getComments:success');
				loadComments(mainContainer, result);
			},
			error: function(err) {
				console.log('ajax:getComments:error');
				console.log(err);
			},
			dataType: 'json'
		})
	} 

	var loadComments = function(container, comments) {
		comments = comments.filter(function(comment) {
			if(comment.parentId === 0) {
				makeComment(container, comment);
				return false;
			} 
			return true;
		});
		comments.sort(function compare(a,b) {
			if(a.id < b.id) return -1;
			if(a.id > b.id) return 1;
			return 0;
		});
		comments.forEach(function(comment){makeComment(container,comment)});
	};

	var makeComment = function(mainContainer, comment) {
		console.log(comment);
		var alreadyExists = $('#comment-container-'+comment.id).length !== 0
		var isRootComment = parseInt(comment.parentId) === 0;
		var parentExists = $('#comment-container-'+comment.parentId).length !== 0;

		if( alreadyExists ) {
			console.log("error, trying to insert same comment twice")
			return;
		} else if ( !isRootComment && !parentExists ) {
			console.log("parent of nonrootcomment does not exist");
			return;
		}

		var newContainer = commentTemplate.clone(true);
		newContainer.attr('id','comment-container-'+comment.id);
		var newComment = newContainer.find(".comment");
		newComment.find('.comment-content p').text(comment.content);
		newComment.find('.info-line .vote-count').text(comment.voteCount);
		newComment.find('.info-line time').text(comment.dateCreated);
		newComment.find('.info-line .author a').text(comment.author.username);

		if(comment.voteValue && comment.voteValue !==0){
			switch(comment.voteValue) {
				case -1:
					console.log("voteValue is -1")
					newContainer.find('.up-vote').toggleClass('voted');
					break;
				case 1:
					newContainer.find('.down-vote').toggleClass('voted');
					break;
			}
		}

		if(comment.hasChild) {
			var loadButton = $('#load-more-template').clone(true);
			loadButton.appendTo(newComment);
			loadButton.show();
			addLoadMoreHandler(loadButton, comment);
		}

		if(thisUser) {
			var up = newContainer.find('.up-vote');
			var down = newContainer.find('.down-vote');
			addVoteHandler(up, down, 1, comment);
			addVoteHandler(down, up, -1, comment);
		}

		var replyButton = newComment.find('.action-line ul .reply');
		if( replyButton.length !== 0 ) {
			addReplySubmitHandler(replyButton, newComment, comment);
		}
		var editButton = newComment.find('.action-line ul .edit');
		if( editButton.length !== 0 ) {
			if(thisUser && thisUser.id === comment.author.id) {
				addEditSubmitHandler(editButton, newComment, comment);
			} else {
				editButton.remove();
			}
		}

		if( isRootComment ) {
			newContainer.appendTo(mainContainer);
		} else {
			newContainer.appendTo($('#comment-container-'+comment.parentId));
		}
		newContainer.show()
	};

	var addVoteHandler = function(button, otherButton, value, parentComment) {
		$(button).on('click', function(e) {
			e.preventDefault();
			$.ajax({
				type: 'POST',
				cache:false,
				url: '/vote',
				data: {
					vote_value: value,
					parent_id:parentComment.id,
					type: thisContent.type
				},
				success: function(result) {
					button.toggleClass('voted');
					otherButton.removeClass('voted');
				},
				error: function(err) {
					console.log('posted comment failure');
				},
			});
		});
	}

	var addLoadMoreHandler = function(button, parentComment) {
		$(button).on('click', function(e) {
			e.preventDefault();
			getComments(parentComment.id);
			$(button).remove();
		})
	}

	var addReplySubmitHandler = function(button, commentBox, parentComment) {
		$(button).click(function(e) {
			e.preventDefault();
			var currentReplyBox = $('#action-box-'+parentComment.id);
			if( currentReplyBox.length !== 0) {
				currentReplyBox.remove();
				if( currentReplyBox.data('action-type') == 'reply') {
					return;
				}
			}
			var replyBox = replyTemplate.clone(true);
			replyBox.attr('id', 'action-box-'+parentComment.id);
			replyBox.data('action-type', 'reply');
			replyBox.find('#reply-parent-id').val(parentComment.id);
			replyBox.appendTo(commentBox);
			replyBox.show();
			var form = replyBox.find('form');
			$(form).on('submit', function(e) {
				e.preventDefault();
				$.ajax({
					type: 'POST',
					cache:false,
					url: $(this).attr('action'),
					data: $(this).serialize(),
					success: function(result) {
						console.log('posted comment success');
						loadComments(mainContainer, result);
						replyBox.remove();
					},
					error: function(err) {
						console.log('posted comment failure');
					},
				});
			});
		});
	}

	var addEditSubmitHandler = function(button, commentBox, parentComment) {
		$(button).click(function(e) {
			e.preventDefault();
			var currentActionBox = $('#action-box-'+parentComment.id);
			if ( currentActionBox.length !== 0) {
				currentActionBox.remove();
				if( currentActionBox.data('action-type') == 'edit') {
					return;
				}
			}
			var editBox = editTemplate.clone(true);
			editBox.attr('id', 'action-box-'+parentComment.id);
			editBox.find('textarea').val($(commentBox).find('.comment-content p').text());
			editBox.find('#edit-comment-id').val(parentComment.id);
			editBox.appendTo(commentBox);
			editBox.show();
			var form = editBox.find('form');
			$(form).on('submit', function(e) {
				e.preventDefault();
				$.ajax({
					type: 'POST',
					cache:false,
					url: $(this).attr('action'),
					data: $(this).serialize(),
					success: function(result) {
						console.log('posted comment success');
						// Wrong?, put successfully posted comment into tree
						loadComments(mainContainer, result);
						editBox.remove();
					},
					error: function(err) {
						console.log('posted comment failure');
					},
				});
			});
		});	
	}

	var count = 0;
	var defer = function(func) {
		if(window.jQuery) {
			func();
		} else {
			count = count+1;
			if(count<50)
				setTimeout(function(){defer(func)}, 50);
		}
	};

	return defer(init);
})();