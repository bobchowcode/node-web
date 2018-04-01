var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');

router.post('/login', passport.authenticate('login', {
    successRedirect: '/productList.html',
    failureRedirect: '/login.html',
    failureFlash: true
}));
// , function (req, res, next) {
//     console.log(req.user);
// });

module.exports = router;