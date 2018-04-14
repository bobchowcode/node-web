var express = require('express');
var _ = require('lodash');
var router = express.Router();
var moment = require('moment');

var Order = require('../models/order');

router.post('/checkout', isLoggedIn, function (req, res, next) {
    var order = new Order();
    order.user = req.user;
    order.cart = req.session.cartList;
    order.address = req.body.addr;
    order.ccNo = order.encryptCCNo(req.body.cc_num);
    order.date = moment();
    order.total = _.sumBy(req.session.cartList, function(o) {
        return o.price * o.quantity;
    });

    order.save(function (err, result) {
        req.session.cartList = null;
        res.redirect('/successCheckOut');
    });
});

router.get('/getSoldGameStatistic', isLoggedIn, function (req, res, next) {
    var query = Order.find({}).select({ "cart.title": 1, "cart.quantity": 1, "_id": 0});
    query.exec(function (err, docs) {
        if (err) {
            return next(err);
        }
        
        var flattenArr = _.flatMapDeep(docs, 'cart');
        var summary = _.map(_.groupBy(flattenArr, 'title'), function(value, key){
            return {
                title: key,
                total: _.sumBy(value, function(o) { return o.quantity; })
            };
        });

        var result = {x:[],y:[]};
        _.forEach(summary, function(value){
            result.x.push(value.title);
            result.y.push(value.total);
        })

        res.send(result);
    });
});

router.get('/getOrderHistory', isLoggedIn, function (req, res, next) {
    var query = Order.find({ "user":req.user._id})
                .select({ "cart": 1, "date": 1, "_id": 0})
                .sort("-date");
    query.exec(function (err, docs) {
        if (err) {      
            return next(err);
        }

        res.send(docs);
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}



module.exports = router;