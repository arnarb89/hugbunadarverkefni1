var kalli = function (){
    if($('#newpassword1').val() !== $('#newpassword2').val()){
        $('#passwordsubmitbutton').attr('disabled','disabled');
        $('#password-message').text("Your passwords do not match");
    }
    else{
        $('#passwordsubmitbutton').removeAttr('disabled');
        $('#password-message').text("");
    }
}

$('#passwordsubmitbutton').attr('disabled','disabled');
$('#newpassword1').keyup(kalli);
$('#newpassword2').keyup(kalli);


console.log("hello");

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