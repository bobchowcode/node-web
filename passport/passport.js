var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use('login', new LocalStrategy({
  passReqToCallback: true
},
  function (req, username, password, done) {
    // check in mongo if a user with username exists or not
    User.findOne({ 'username': username },
      function (err, user) {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!user) {
          console.log('User Not Found with username ' + username);
          return done(null, false,
            req.flash('message', 'User Not found.'));
        }
        // User exists but wrong password, log the error 
        // if (!isValidPassword(user, password)){
        if (password !== user.password) {
          console.log('Invalid Password');
          return done(null, false,
            req.flash('message', 'Invalid Password'));
        }
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, user);
      }
    );
  }));

passport.use('signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, username, password, done) {

  User.findOne({
    'username': username
  }, function (err, user) {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, false, req.flash('errMsg', 'This username is already been used.'));
    }
    var newUser = new User();
    newUser.username = username;
    newUser.password = newUser.encryptPassword(password);
    newUser.email = req.body.email;
    newUser.role = "customer"
    newUser.save(function (err, result) {
      if (err) {
        return done(err);
      }
      return done(null, newUser);
    });
  });
}));