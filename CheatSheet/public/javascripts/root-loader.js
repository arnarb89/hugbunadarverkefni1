(function() {

	var init = function() {
		$('.school-button').each(function(index, schoolButton)
		{
			$(schoolButton).click(function(e){
				e.preventDefault();
				var container = $(schoolButton).parent().find('.school-children-container');
				var schoolId = $(schoolButton).data('school-id');
				$.ajax({
					type:'post',
					dataType:'json',
					url:'/department/',
					data: {
						schoolId:schoolId
					},
					success: function(res) {
						$.each(res, function(i, dptmnt) {
							makeDptmnt(dptmnt, schoolButton, container);
						});
						makeDepartmentForm(schoolButton, container);
					},
					errror:function(err){
						alert('');
					},
					async:true
				});
				$('.school-children-container').each(function(otherContainer){
						$(this).hide();
				});
				container.show();
				$(schoolButton).unbind('click');
				$(schoolButton).click(function(e){
					e.preventDefault();
					var test = $(container).is(':visible');
					if(test){
						container.toggle();
					} else {
						$('.school-children-container').each(function(otherContainer){
							$(this).hide();
						})
						container.toggle();
					}
				})
			});
		});
	};

	var makeDptmnt = function(dptmnt, schoolButton, container) {
		if($('#department-button-'+dptmnt.id).length !== 0){
			return;
		}
		var box = $('<div />', {class:'department-container'});
		var dptmntButton = $('<a />', {
			class:'btn btn-primary fullWidth department-button',
			id: 'department-button-'+dptmnt.id
		}).html(dptmnt.name)
		.data('department-id',dptmnt.id).appendTo(box);
		var childrenContainer = $('<div />', {class:'department-children-container'});
		childrenContainer.appendTo(box)
		container.append(box);
		$(dptmntButton).click(function(e) {
			e.preventDefault();
			var data = {
				departmentId:$(dptmntButton).data('department-id')
			};
			$.ajax({
				type:'post',
				dataType:'json',
				url:'/major/async',
				data: data,
				success: function(res) {
					$.each(res, function(i, major) {
						makeMajor(major, dptmntButton, childrenContainer)
					});
					makeMajorForm(dptmntButton, childrenContainer);
				},
				errror:function(err){
					alert('');
				},
				async:true
			})
			$(dptmntButton).unbind('click');
			$('.department-children-container').each(function(otherContainer){
				$(this).hide();
			})
			childrenContainer.show();
			$(dptmntButton).click(function(){
				e.preventDefault();
				if($(childrenContainer).is(':visible')){
					childrenContainer.toggle();
				} else {
					$('.department-children-container').each(function(otherContainer){
						$(this).hide();
					})
					childrenContainer.toggle();
				}
			});
		});
	}

	var makeDepartmentForm = function(schoolButton, container) {
		var schoolId = $(schoolButton).data('school-id');
		if($('#department-form-' + schoolId).length !== 0) {
			return;
		}
		var template = $('#template-form-department').clone(true);
		template.attr('id', 'department-form-' + schoolId);
		var inputName = template.find('#department-name');
		var openButton = template.find('#button-form-open');
		var submitButton = template.find('#button-form-submit');
		var cancelButton = template.find('#button-form-cancel');
		var formBox = template.find('#form-box');
		openButton.click(function(e){
	        e.preventDefault();
	        $(formBox).show();
	    });
	    cancelButton.on('click',function(e){
	        e.preventDefault();
	        $(formBox).hide();
	    });
		submitButton.click(function(e){
	        e.preventDefault();
	        $.ajax({
	            url: '/department/create',
	            type: 'post',
	            dataType: 'json',
	            data: {
	            	schoolId: schoolId,
	            	departmentName: $(inputName).val()
	            },
	            cache:false,
	            async: true,
	            success: function(data){    
                    location.reload();
	            },
	            error: function(err){
	            	alert('something somewhere');
	            }
	        });
	    });
	    template.appendTo( container );
	    template.show()
	}

	var makeMajor = function(major, dptmntButton, container) {
		if( $('#major-button-'+major.id).length !== 0) {
			return;
		}
		var box = $('<div />', {
			class:'major-container',
			id: 'major-button-'+major.id
		});
		var button = $('<a />', {
			class:'btn btn-info fullWidth major-button',
			href:'/major/'+major.id,
		});
		button.html(major.name);
		box.append(button);
		box.appendTo(container);
		// $(dptmntButton).parent().append(box);
	};

	var makeMajorForm = function(dptmntButton, container) {
		var departmentId = $(dptmntButton).data('department-id');
		if($('#major-form-' + departmentId).length !== 0) {
			return;
		}
		var template = $('#template-form-major').clone(true);
		template.attr('id', 'major-form-' + departmentId);
		var inputName = template.find('#major-name')
		var openButton = template.find('#button-form-open');
		var submitButton = template.find('#button-form-submit');
		var cancelButton = template.find('#button-form-cancel');
		var formBox = template.find('#form-box');
		openButton.click(function(e){
	        e.preventDefault();
	        $(formBox).show();
	    });
	    cancelButton.on('click',function(e){
	        e.preventDefault();
	        $(formBox).hide();
	    });
		submitButton.click(function(e){
	        e.preventDefault();
	        $.ajax({
	            url: '/major/addnewmajor',
	            type: 'post',
	            dataType: 'json',
	            data: {
	            	departmentid: departmentId,
	            	majorname: $(inputName).val()
	            },
	            cache:false,
	            async: true,
	            success: function(data){  
	            	console.log(JSON.stringify(data));
                    location.reload();
	            },
	            error: function(err){
	            	alert('something somewhere');
	            }
	        });
	    });
	    // template.appendTo( $(dptmntButton).parent() );
	    template.appendTo( container );
	    template.show()
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




if($('#addNewSchoolForm')){
    $('#addNewSchoolFormSubmit').on('click',function(e){
        e.preventDefault();
        var payload = {
            schoolName: $('#addNewSchoolFormSchoolName').val()
        };
        $.ajax({
            url: '/school',
            type: 'post',
            dataType: 'json',
            data: payload,
            cache:false,
            async: true,
            success: function(data){    
                if(data.error){
                    alert(data.error);
                }else if(data.success){
                    location.reload();
                }else {
                    alert("Something else.");
                }
            }
        });
    });
};

if($('#addNewSchoolFormOpen')){

    $('#addNewSchoolFormOpen').on('click',function(e){
        e.preventDefault();
        $('#addNewSchoolForm').show();
    });
};

if($('#addNewSchoolFormCancel')){
    $('#addNewSchoolFormCancel').on('click',function(e){
        e.preventDefault();
        $('#addNewSchoolForm').hide();
    });
};
