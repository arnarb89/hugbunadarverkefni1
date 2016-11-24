(function() {

	var commentTemplate;
	var mainContainer;
	var commentType;
	var replyTemplate;
	var editTemplate;
	var thisUser;
	var thisContent;

	var init = function() {
		mainContainer = $('#comment-main-container');
		commentTemplate = $('#comment-container-template');
		replyTemplate = $('#reply-box-template');
		editTemplate = $('#edit-box-template');
		commentType = commentTemplate.data('commenttype');
		if(typeof user !== 'undefined')
			thisUser = user;
		if(typeof contentInfo !== 'undefined')
			thisContent = contentInfo;
		if(typeof getLatestComments !== 'undefined') {
			getLatest(mainContainer, 10);
		} else if(typeof contentInfo !== 'undefined') {
			console.log(JSON.stringify(contentInfo))
			if(typeof user !== 'undefined')
				makeReplyToRootForm(mainContainer);
			getComments(mainContainer, 0);
		}
	};

	var getComments = function(container, parentId) {
		console.log('getComments()');
		var payload = {
			parentId:parentId,
			type: thisContent.type,
			parentContentId: thisContent.id
		};
		$.ajax({
			type: 'post',
			url: '/comment/async',
			data: payload,
			success: function(result) {
				console.log('ajax:getComments:success');
				loadComments(container, result);
				if($('.comment-box').length > 1) {
					$('#no-comment-message').hide();
				}
			},
			error: function(err) {
				console.log('ajax:getComments:error');
				console.log(err);
			},
			dataType: 'json'
		})
	} 

	var getLatest = function(container, amount) {
		console.log('getComments()');
		$.ajax({
			type: 'POST',
			url: '/comment/async/latest',
			data: {
				amount: amount
			},
			success: function(result) {
				loadComments(container, result);
				if($('.comment-box').length > 1) {
					$('#no-comment-message').hide();
				}
			},
			error: function(err) {
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
		var voteCounter = newComment.find('.info-line .vote-count');
		voteCounter.text(comment.voteCount);
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
			upVoteHandler(up, down, 1, comment, voteCounter);
			downVoteHandler(down, up, -1, comment, voteCounter);
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

	var makeReplyToRootForm = function(mainContainer){
		var replyBox = replyTemplate.clone(true);
		replyBox.attr('id', 'action-box-reply-root');
		replyBox.data('action-type', 'reply');
		replyBox.toggleClass('root-form-reply')
		replyBox.find('#reply-parent-id').val(0);
		replyBox.appendTo(mainContainer);
		replyBox.show();
		var form = replyBox.find('form');
		form.find('textarea').attr('placeholder', 'Anything you want to discuss?');
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
	}

	var downVoteHandler = function(downButton, upButton, value, parentComment, voteCounter) {
		$(downButton).on('click', function(e) {
			e.preventDefault();
			$.ajax({
				type: 'POST',
				cache:false,
				url: '/vote',
				data: {
					voteValue: value,
					parentId:parentComment.id,
					type: thisContent.type,
					parentContentId: thisContent.id
				},
				success: function(result) {
					var curr = parseInt(voteCounter.text());
					if($(downButton).hasClass('voted')){
						downButton.toggleClass('voted');
						voteCounter.text(curr+1);
					} else if($(upButton).hasClass('voted')){
						downButton.toggleClass('voted');
						upButton.toggleClass('voted');
						voteCounter.text(curr-2);
					} else {
						voteCounter.text(curr-1);
						downButton.toggleClass('voted');
					}
				},
				error: function(err) {
					console.log('posted comment failure');
				},
			});
		});
	}
	var upVoteHandler = function(upButton, downButton, value, parentComment, voteCounter) {
		$(upButton).on('click', function(e) {
			e.preventDefault();
			$.ajax({
				type: 'POST',
				cache:false,
				url: '/vote',
				data: {
					voteValue: value,
					parentId:parentComment.id,
					type: thisContent.type,
					parentContentId: thisContent.id
				},
				success: function(result) {
					var curr = parseInt(voteCounter.text());
					if($(upButton).hasClass('voted')){
						upButton.toggleClass('voted');
						voteCounter.text(curr-1);
					} else if ($(downButton).hasClass('voted')){
						downButton.removeClass('voted');
						upButton.toggleClass('voted');
						voteCounter.text(curr+2)
					} else {
						upButton.toggleClass('voted');
						voteCounter.text(curr+1)

					}
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
			getComments(mainContainer, parentComment.id);
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