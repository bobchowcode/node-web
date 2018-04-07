var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

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
    if (req.session.cartList) {
        cartList = req.session.cartList;
    } else {
        cartList = [];
    }
    req.body.quantity = 1;
    if (cartList.length == 0) {
        cartList.push(req.body);
    } else {
        var idx = _.findIndex(cartList, function(o) {
            return o._id === req.body._id;
        });
        if (idx >= 0) {
            cartList[idx].quantity++;
        } else {
            cartList.push(req.body);
        }
    }
    req.session.cartList = cartList;

    res.json({res:"success"});
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

router.post('/minusProduct', function (req, res, next) {
    console.log("minusProduct");
    console.log(req.session);
    var cartList;
    if (req.session.cartList) {
        cartList = req.session.cartList;
    } else {
        cartList = [];
    }
    if (cartList.length > 0) {
        var idx = _.findIndex(cartList, function(o) {
            return o._id === req.body._id;
        });
        if (idx >= 0) {
            cartList[idx].quantity--;
        }
        if (cartList[idx].quantity <= 0) {
            _.remove(cartList, function(o) {
                return o._id === cartList[idx]._id;
            });
        }
    }
    req.session.cartList = cartList;

    res.json({res:"success"});
});

router.post('/createNewProduct', function (req, res) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = path.join(__dirname, '/../public/images');
    form.multiples = false;
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        if (err) throw err;
        console.log(fields);
        console.log(files);
    });
    form.on('file', function (name, file) {
        console.log(name + ': ' + file.name);
        if (file.name) {
            fs.rename(file.path, path.join(form.uploadDir, file.name), function (err) {
                if (err) throw err;
            });
        }
    });
    form.on('field', function (name, value) {
        console.log(name + ': ' + value);
    });
    form.on('end', function () {
        res.end();
    });
});

router.get('/getFeaturedProducts', function (req, res, next) {
    Product.find({"featured":true}).exec(function (err, docs) {
        if (err) {
            res.send(err);
        }
        res.send(docs);
    });
});

module.exports = router;