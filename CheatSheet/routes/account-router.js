'use strict';

var accountManager = require('../lib/managers/comment-manager');
var router = require('express').Router();
var isAuthenticated = require('../lib/isAuthenticated');

router.get('/', isAuthenticated, function (req, res) {
	// Render account settings page
	// accountManager
});