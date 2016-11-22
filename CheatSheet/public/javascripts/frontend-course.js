

console.log("hello");

if($('#addToHotbar')){

    $('#addToHotbar').on('click',function(e){
        console.log("Clicked add to hotbar.");
        e.preventDefault();
        //do some verification
        // /:type/:id/:contentname
        var temporaryInfo = {
            type: $('#contenttype').html(),
            contentid: $('#contentid').html(),
            contentname: $('#contentname').html()
        };
        $.ajax({
            url: 'http://localhost:8080/account/addhotbarelement',
            type: 'post',
            dataType: 'json',
            data: temporaryInfo,
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
        });
    });
};

/*
if($('#addNewCourseForm')){

    $('#addNewCourseFormSubmit').on('click',function(e){
        console.log("Clicked add new course.");
        e.preventDefault();
        //do some verification
        // /:type/:id/:contentname
        var temporaryInfo = {
            majorid: $('#contentid').html(),
            courseidentificationcode: $('#addNewCourseFormIdCode').val(),
            coursename: $('#addNewCourseFormCourseName').val()
        };
        $.ajax({
            url: 'http://localhost:8080/course/addnewcourse',
            type: 'post',
            dataType: 'json',
            data: temporaryInfo,
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
        });
    });
};



if($('#addNewCourseFormOpen')){

    $('#addNewCourseFormOpen').on('click',function(e){
        console.log("Clicked show.");
        e.preventDefault();
        //do some verification
        $('#addNewCourseForm').show();
    });
};

if($('#addNewCourseFormCancel')){

    $('#addNewCourseFormCancel').on('click',function(e){
        console.log("Clicked cancel.");
        e.preventDefault();
        //do some verification
        $('#addNewCourseForm').hide();
    });
};*/


/*$('#updateProfileForm').submit(function(e){
    console.log("Clicked submit profile information.");
    e.preventDefault();
    //do some verification
    $.ajax({
        url: 'http://localhost:8080/account/updateprofile',
        type: 'post',
        dataType: 'json',
        data: $(this).serialize(),
        cache:false,
        async: true,
        success: function(data){    
            console.log("Async call has returned.")
            //callback methods go right here
            if(data.data=="error"){
                $('#profileMessage').text("Error. Try again.");
            }else if(data.data=="success"){
                $('#profileMessage').text("Profile information updated.");
            }else {
                $('#profileMessage').text("Something else.");
            }
        }
    });
});*/

/*$('#updateUsernameForm').submit(function(e){
    console.log("Clicked submit username information.");
    e.preventDefault();
    //do some verification
    $.ajax({
        url: 'http://localhost:8080/account/updateusername',
        type: 'post',
        dataType: 'json',
        data: $(this).serialize(),
        cache:false,
        async: true,
        success: function(data){    
            console.log("Async call has returned.")
            //callback methods go right here
            if(data.data=="error"){
                $('#usernameMessage').text("Error. Try again.");
            }else if(data.data=="success"){
                $('#usernameMessage').text("Username information updated.");

            }else {
                $('#usernameMessage').text("Something else.");
            }
        }
    });
});*/