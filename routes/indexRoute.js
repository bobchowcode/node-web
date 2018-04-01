var express = require('express');
var router = express.Router();
var path = require('path');
var cheerio = require('cheerio');
var fs = require('fs');

router.get('/', function (req, res, next) {
    var tmp = path.join(__dirname, '/../views/login.html');
    var $ = cheerio.load(fs.readFileSync(tmp));
    $('#test').text('Hello there!');
    $('#remove').remove();
    console.log(tmp);
    res.send($.html());
});

module.exports = router;