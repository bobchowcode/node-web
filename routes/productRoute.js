var express = require('express');
var router = express.Router();

var Product = require('../models/product');

router.get('/getFullProducts', function (req, res, next) {
    Product.find(function (err, docs) {
        if (err) {
            res.send(err);
        }
        res.send(docs);
    });
});

router.post('/addToCart', function (req, res, next) {
    console.log("addToCart");
    console.log(req.session);
    var cartList;
    if(req.session.cartList) {
        cartList = req.session.cartList;
    } else {
        cartList = [];
    }
    cartList.push(req.body);
    req.session.cartList = cartList;

    res.send("success");
});

router.get('/getCartList', function (req, res, next) {
    console.log("getCartList");
    console.log(req.session);

    // if(req.session.page_views){
    //     req.session.page_views++;
    //     res.send("You visited this page " + req.session.page_views + " times");
    //  } else {
    //     req.session.page_views = 1;
    //     res.send("Welcome to this page for the first time!");
    //  }
    console.log("getCartList");
    console.log(req.session);
    
    res.send(req.session.cartList);
});

module.exports = router;