
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

	// return defer(init);