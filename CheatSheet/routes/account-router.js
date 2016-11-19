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
			if(req.session.usernamechangesuccess){
				var temp = req.session.usernamechangesuccess;
				req.session.usernamechangesuccess = null;
				res.render('placeholder-account', { renderData, message: req.flash('message'), usernameMessage: temp });
			}else if(req.session.profilechangesuccess){
				var temp = req.session.profilechangesuccess;
				req.session.profilechangesuccess = null;
				res.render('placeholder-account', { renderData, message: req.flash('message'), profileMessage: temp });
			}else if(req.session.passwordchangesuccess){
				var temp = req.session.passwordchangesuccess;
				req.session.passwordchangesuccess = null;
				res.render('placeholder-account', { renderData, message: req.flash('message'), passwordMessage: temp });
			}else {
				res.render('placeholder-account', { renderData, message: req.flash('message') });
			}
		}
		else{
			res.redirect('/');
		}
	});

	router.post('/updateprofile', isNotAuthenticated, function(req,res){
		// ability to remove hotbar elements, should probably be async
		// ability to change (username), (pw), email, fullname... might be a good idea to have it async
		// function (fullname, email, username, id, callback)
		console.log("/updateprofile router was accessed");
		userManager.updateProfileInformation(req.body.fullname,req.body.email, req.session.passport.user.id, function(err,result){
			console.log("/updateprofile... before if else");
			if(err){
				req.session.profilechangesuccess = "There was an error. Try again.";
				return res.redirect('/account');
			}
			else{
				req.session.profilechangesuccess = "Profile information was successfully changed.";
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
				req.session.usernamechangesuccess = "There was an error. Try again.";
				return res.redirect('/account');
			}
			else{
				req.session.usernamechangesuccess = "Username was successfully changed.";
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
                    req.session.passwordchangesuccess = "There was an error.";
					return res.redirect('/account');
                }
                if (!isValidPassword(result.rows[0], req.body.oldpassword)){
                    req.session.passwordchangesuccess = "The old password was not correct.";
					return res.redirect('/account');
                }
                console.log("updatepassword spot 10");
				userManager.updatePasswordInformation(createHash(req.body.newpassword1), req.user.id, function(err,result){
					if(err){
						console.log("updatepassword spot 12, err: "+err)
						req.session.passwordchangesuccess = "There was an error.";
						return res.redirect('/account');
					}
					else{
						req.session.passwordchangesuccess = "Password was successfully changed.";
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