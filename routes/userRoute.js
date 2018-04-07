var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');

router.post('/login', passport.authenticate('login', {
    successRedirect: '/productList',
    failureRedirect: '/loginWithError',
    failureFlash: true
}));
// , function (req, res, next) {
//     console.log(req.user);
// });

router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/productList',
    failureRedirect: '/signupWithError',
    failureFlash: true
}));

router.get('/logout', function (req, res) {
    // req.logout();
    // res.redirect('/');
    req.session.destroy(function(err) {
        res.redirect('/');
    });
});

module.exports = router;