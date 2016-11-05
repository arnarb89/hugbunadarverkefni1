'use strict';

var accountManager = require('../lib/managers/comment-manager.js');
var router = require('express').Router();

router.get('/', function (req, res) {
	// Render account settings page
	res.render('index', {title:'account'});
});