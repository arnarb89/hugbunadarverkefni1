'use strict';

var accountManager = require('../lib/managers/account-manager');
var router = require('express').Router();
var userManager = require('../cs-managers/userManager.js');
var bCrypt = require('bcrypt-nodejs');


var isNotAuthenticated = function (req, res, next) {
	'use strict';
	if (req.isAuthenticated()){
		return next();
		
	}
	res.redirect('/');
};


module.exports = function(passport){
	'use strict';

	router.get('/', function(req, res) {
		if(req.isAuthenticated()){
			var renderData = {};

			// get hotbar elements
			// get the email, fullname, (username)
			if(req.session.changesuccessmessage){
				var temp = req.session.changesuccessmessage;
				req.session.changesuccessmessage = null;
				res.render('placeholder-account', { renderData, message: req.flash('message'), changesuccessmessage: temp });
			}else {
				res.render('placeholder-account', { renderData, message: req.flash('message') });
			}
		}
		else{
			res.redirect('/');
		}
	});

	router.get('/removehotbarelement/:type/:id', isNotAuthenticated, function(req,res){
		// ability to remove hotbar elements, should probably be async
		// ability to change (username), (pw), email, fullname... might be a good idea to have it async
		// function (fullname, email, username, id, callback)
		console.log("/removehotbarelement router was accessed");
		console.log("type: "+req.params.type);
		console.log("id: "+req.params.id);

		//accountManager.removeHotbarElement = function (userid,type,elementid, callback) {
		//return res.redirect('/account');
		accountManager.removeHotbarElement(req.user.id,req.params.id, req.params.type, function(err,result){
			console.log("/updateprofile... before if else");
			if(err){
				req.session.changesuccessmessage = "There was an error. Try again.";
				return res.redirect('/account');
			}
			else{
				req.session.changesuccessmessage = "The hotbar element was successfully removed.";
				return res.redirect('/account');
			}
			console.log("/updateprofile... after if else");
		});
	});

	router.post('/updateprofile', isNotAuthenticated, function(req,res){
		// ability to remove hotbar elements, should probably be async
		// ability to change (username), (pw), email, fullname... might be a good idea to have it async
		// function (fullname, email, username, id, callback)
		console.log("/updateprofile router was accessed");
		userManager.updateProfileInformation(req.body.fullname,req.body.email, req.session.passport.user.id, function(err,result){
			console.log("/updateprofile... before if else");
			if(err){
				req.session.changesuccessmessage = "There was an error. Try again.";
				return res.redirect('/account');
			}
			else{
				req.session.changesuccessmessage = "Profile information was successfully changed.";
				return res.redirect('/account');
			}
			console.log("/updateprofile... after if else");
		});
		console.log("/updateprofile... after userManager");
	});

	router.post('/updateusername', isNotAuthenticated, function(req,res){
		if(req.user.facebookid!==null){
			return res.redirect('/');
		}
		// ability to remove hotbar elements, should probably be async
		// ability to change (username), (pw), email, fullname... might be a good idea to have it async
		userManager.updateUsernameInformation(req.body.username, req.session.passport.user.id, function(err,result){
			if(err){
				req.session.changesuccessmessage = "There was an error. Try again.";
				return res.redirect('/account');
			}
			else{
				req.session.changesuccessmessage = "Username was successfully changed.";
				return res.redirect('/account');
			}
		});
	});

	router.post('/updatepassword', isNotAuthenticated, function(req,res){
		if(req.user.facebookid!==null){
			return res.redirect('/');
		}
		// ability to remove hotbar elements, should probably be async
		// ability to change (username), (pw), email, fullname... might be a good idea to have it async
		userManager.getLocalUserByUsername(req.user.username, function(err, result) {

                if (err){
                    req.session.changesuccessmessage = "There was an error.";
					return res.redirect('/account');
                }
                if (!isValidPassword(result.rows[0], req.body.oldpassword)){
                    req.session.changesuccessmessage = "The old password was not correct.";
					return res.redirect('/account');
                }
                console.log("updatepassword spot 10");
				userManager.updatePasswordInformation(createHash(req.body.newpassword1), req.user.id, function(err,result){
					if(err){
						console.log("updatepassword spot 12, err: "+err)
						req.session.changesuccessmessage = "There was an error.";
						return res.redirect('/account');
					}
					else{
						req.session.changesuccessmessage = "Password was successfully changed.";
						return res.redirect('/account');
					}
				});

                
        });
		// Generates hash using bCrypt
	    var createHash = function(password){
	        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	    };

		var isValidPassword = function(user, password){
	        return bCrypt.compareSync(password, user.passwordhash);
	    };
	});


	return router;
};