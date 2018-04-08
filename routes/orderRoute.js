var express = require('express');
var _ = require('lodash');
var router = express.Router();

var Order = require('../models/order');

router.post('/checkout', isLoggedIn, function (req, res, next) {
    var order = new Order({
        user: req.user,
        cart: req.session.cartList,
        address: req.body.addr,
        ccNo: req.body.cc_num
    });
    order.save(function (err, result) {
        req.session.cartList = null;
        res.redirect('/successCheckOut');
    });
});

router.get('/getSoldGameStatistic', function (req, res, next) {
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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}



module.exports = router;