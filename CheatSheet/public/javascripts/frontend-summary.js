(function() {

	var voteContainer;
	var upVoteButton;
	var downVoteButton;
	var voteCountContainer;
	var thisContent;


	function init() {
		if(!window.jQuery) {
			return setTimeout(function() { init() }, 50);
		}
		
		// console.log("I'm in init");

		voteContainer = $('#vote-container');
		upButton = voteContainer.find('#upVote-button');
		downButton = voteContainer.find('#downVote-button');
		voteCounter = voteContainer.find('#voteCounter');
		if(typeof contentInfo !== 'undefined') thisContent = contentInfo;

		upVoteHandler(upButton, downButton, voteCounter);
		downVoteHandler(downButton, upButton, voteCounter);
	};
	

	var upVoteHandler = function(upButton, downButton, voteCounter) {
		// console.log("I'm in upVoteHandler");
		var value = 1;
		$(upButton).on('click', function(e) {
			e.preventDefault();
			$.ajax({
				type: 'POST',
				cache:false,
				url: '/vote/summary',
				data: {
					voteValue: value,
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
					console.log('vote failure ERROR ERROR!');
				},
			});
		});
	}

	var downVoteHandler = function(downButton, upButton, voteCounter) {
		var value = -1;
		$(downButton).on('click', function(e) {
			e.preventDefault();
			$.ajax({
				type: 'POST',
				cache:false,
				url: '/vote/summary',
				data: {
					voteValue: value,
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
					console.log('vote failure ERROR ERROR!');
				},
			});
		});
	}

	return init();

})();


	// var init = function() {
	// 	mainContainer = $('#comment-main-container');
	// 	commentTemplate = $('#comment-container-template');
	// 	replyTemplate = $('#reply-box-template');
	// 	editTemplate = $('#edit-box-template');
	// 	commentType = commentTemplate.data('commenttype');
	// 	if(typeof user !== 'undefined')
	// 		thisUser = user;
	// 	if(typeof contentInfo !== 'undefined')
	// 		thisContent = contentInfo;
	// 	if(typeof getLatestComments !== 'undefined') {
	// 		getLatest(mainContainer, 10);
	// 	} else if(typeof contentInfo !== 'undefined') {
	// 		console.log(JSON.stringify(contentInfo))
	// 		if(typeof user !== 'undefined')
	// 			makeReplyToRootForm(mainContainer);
	// 		getComments(mainContainer, 0);
	// 	}
	// };

	


	