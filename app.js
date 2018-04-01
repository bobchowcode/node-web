var express = require('express');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var expressSession = require('express-session');

var session = require('express-session');
const MongoStore = require('connect-mongo')(session);

var routes = require('./routes/indexRoute');
var userRoutes = require('./routes/userRoute');
var productRoutes = require('./routes/productRoute');
var orderRoutes = require('./routes/orderRoute');

var config = require("./config");

var app = express();

var mongodbUrl = "mongodb://" + config.mongodb.username + ":" + config.mongodb.password + "@" + config.mongodb.url + "/" + config.mongodb.database + "?replicaSet=eu-6";
mongoose.connect(mongodbUrl);
require('./passport/passport');

app.use(cookieParser());
app.use(session({
    secret: '4346E88ED53FDE699158DAE8CDF7B', 
    store: new MongoStore({ url: mongodbUrl }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', routes);
app.use('/product', productRoutes);
app.use('/user', userRoutes);
app.use('/order', orderRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});