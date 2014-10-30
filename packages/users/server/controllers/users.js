'use strict';

/* Need to load this manually for jscover */
require('../models/user');

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');

/**
 * Logout
 */
exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * Create user
 */
exports.create = function(req, res, next) {
  var user = new User(req.body);

  user.provider = 'local';

  // because we set our user.provider to local our models/user.js validation will always be true
  req.assert('name', 'You must enter a name').notEmpty();
  req.assert('email', 'You must enter a valid email address').isEmail();
  req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
  req.assert('username', 'Username cannot be more than 20 characters').len(1, 20);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  // Hard coded for now. Will address this with the user permissions system in v0.3.5
  user.roles = ['authenticated'];
  user.save(function(err) {
    if (err) {
      switch (err.code) {
        case 11000:
        case 11001:
          res.status(400).send([{
            msg: 'Username already taken',
            param: 'username'
          }]);
          break;
        default:
          var modelErrors = [];

          if (err.errors) {

            for (var x in err.errors) {
              modelErrors.push({
                param: x,
                msg: err.errors[x].message,
                value: err.errors[x].value
              });
            }

            res.status(400).send(modelErrors);
          }
      }

      return res.status(400);
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/');
    });
    res.status(200);
  });
};


/**
 * Search for user by username
 */
exports.findUser = function(req, res, next) {
  User
    .find({
      $or: [
      {'name': { $regex: req.params.username, $options: 'i' }},
      {'username': { $regex: req.params.username, $options: 'i' }},
      {'email': { $regex: req.params.username, $options: 'i' }}
      ]
    }).select('name username email')
    .exec(function(err, users) {
      if (err) return next(err);
      if (!users) return next(new Error('No users found'));
      res.json(users);
    });
};
