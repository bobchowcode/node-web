var express = require('express');
var router = express.Router();
var path = require('path');
var cheerio = require('cheerio');
var fs = require('fs');

router.get('/', function (req, res, next) {
    var filePath = path.join(__dirname, '/../views/index.html');
    var $ = cheerio.load(fs.readFileSync(filePath));

    var navContent = cheerio.load(fs.readFileSync(path.join(__dirname, '/../views/nav-bar.html'))).html();

    $('nav-bar').replaceWith(headerContent);
    res.send($.html());
});

module.exports = router;