var express = require('express');
var router = express.Router();

var Order = require('../models/order');

router.post('/checkout', isLoggedIn, function (req, res, next) {
    var order = new Order({
        user: req.session.user,
        cart: req.session.cartList,
        address: req.body.addr,
        ccNo: req.body.cc_num
    });
    order.save(function (err, result) {
        req.session.cartList = null;
        res.redirect('/successCheckOut');
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}



module.exports = router;