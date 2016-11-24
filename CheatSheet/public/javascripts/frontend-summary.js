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
		addToHotBarHandler();
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
						downButton.toggleClass('btn-danger');
						upButton.toggleClass('voted');
						voteCounter.text(curr+2)
					} else {
						upButton.toggleClass('voted');
						voteCounter.text(curr+1)
					}
					upButton.toggleClass('btn-success');
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
						upButton.toggleClass('btn-success');
						voteCounter.text(curr-2);
					} else {
						voteCounter.text(curr-1);
						downButton.toggleClass('voted');
					}
					downButton.toggleClass('btn-danger');
				},
				error: function(err) {
					console.log('vote failure ERROR ERROR!');
				},
			});
		});
	}

	var addToHotBarHandler = function() {
		$('#addToHotbar-button').on('click',function(e){
	        console.log("Clicked add to hotbar.");
	        e.preventDefault();
	        //do some verification
	        // /:type/:id/:contentname

	        $.ajax({
	            url: '/account/addhotbarelement',
	            type: 'post',
	            // dataType: 'json',
	            data: {
	            	type: $('#contentType').text(),
		            contentid: $('#contentId').text(),
		            contentname: $('#contentName').text()
	            },
	            cache:false,
	            async: true,
	            success: function(data){    
	                console.log("Async call has returned.")
	                //callback methods go right here
	                if(data.error){
	                    //$('#profileMessage').text(data);
	                    alert(data.error);
	                }else if(data.success){
	                    //$('#profileMessage').text(data);
	                    location.reload();
	                    //alert(data.success);
	                }else {
	                    //$('#profileMessage').text("Something else.");
	                    alert("Something else.");
	                }
            	}
            	// error: function(err) {
            	// 	console.log('Error adding to hotbar');
            	// 	console.log(err);
            	// }
        	});
    	});
	};

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

	


	