var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// passport.use('local.signup', new LocalStrategy({
//   usernameField: 'email',
//   passwordField: 'password',
//   passReqToCallback: true
// }, function(req, email, password, done) {
//   req.checkBody('email', 'Email inválido!').notEmpty().isEmail();
//   req.checkBody('password', 'Senha inválida!').notEmpty().isLength({
//     min: 4
//   });

//   var errors = req.validationErrors();
//   if (errors) {
//     var messages = [];
//     errors.forEach(function(error) {
//       messages.push(error.msg);
//     });
//     return done(null, false, req.flash('error', messages));
//   }
//   User.findOne({
//     'email': email
//   }, function(err, user) {
//     if (err) {
//       return done(err);
//     }
//     if (user) {
//       return done(null, false, {
//         message: 'Este email já está sendo usado.'
//       });
//     }
//     var newUser = new User();
//     newUser.name = req.body.name;
//     newUser.city = req.body.city;
//     newUser.state = req.body.state;
//     newUser.email = email;
//     newUser.password = newUser.encryptPassword(password);
//     newUser.save(function(err, result) {
//       if (err) {
//         return done(err);
//       }
//       return done(null, newUser);
//     });
//   });
// }));

passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    // check in mongo if a user with username exists or not
    User.findOne({ 'username' :  username }, 
      function(err, user) {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!user){
          console.log('User Not Found with username '+username);
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