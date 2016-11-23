var kalli = function (){
    if($('#password').val() !== $('#password2').val()){
        $('input[type="submit"]').attr('disabled','disabled');
        $('#password-message').text("Your passwords do not match");
    }
    else{
        $('input[type="submit"]').removeAttr('disabled');
        $('#password-message').text("");
    }
}

$('input[type="submit"]').attr('disabled','disabled');
$('#password').keyup(kalli);
$('#password2').keyup(kalli);