/*function isFormCorrect(){
    var result = false;
    if (($('#password').val() === $('#password2').val()) &&
        ($('#username').val().length  > 0) &&
        ($('#email').val().length > 0)&&
        ($('#fullname').val().length > 0)&&
        ($('#password').val().length > 0)) {
            result = true;
    }
    return result;
}*/
var kalli = function (){
    if($('#password').val() !== $('#password2').val()){
        $('input[type="submit"]').attr('disabled','disabled');
        $('#password-message').text("Your passwords do not match.");
    }
    else{
        $('input[type="submit"]').removeAttr('disabled');
        $('#password-message').text("");
    }
}

$('input[type="submit"]').attr('disabled','disabled');
$('#password').keyup(kalli);
$('#password2').keyup(kalli);