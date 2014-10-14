'use strict';

/**
 * Module dependencies.
 users = require('../../../users/server/controllers/users')
 */
var mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
  _ = require('lodash'),
  User = mongoose.model('User');


/**
 * Find article by id
 */
exports.article = function(req, res, next, id) {
  Article.load(id, function(err, article) {
    if (err) return next(err);
    if (!article) return next(new Error('Failed to load article ' + id));
    req.article = article;
    next();
  });
};

/**
 * Create an article
 */
exports.create = function(req, res) {
  User.find({'username': req.body.user }, function (err, username) {
    if (err) {
      return res.json(500, {
        error: 'Cannot save the article: ' + err
      });
    }

    var article = new Article({
      'content': req.body.content,
      'user': username[0],
      'author': req.user
    });

    article.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot save the article: ' + err
      });
    }
    res.json(article);
    });
  });
};

/**
 * Update an article
 */
exports.update = function(req, res) {
  var article = req.article;

  article = _.extend(article, req.body);

  article.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot update the article'
      });
    }
    res.json(article);

  });
};

/**
 * Delete an article
 */
exports.destroy = function(req, res) {
  var article = req.article;

  article.remove(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot delete the article'
      });
    }
    res.json(article);

  });
};

/**
 * Show an article
 */
exports.show = function(req, res) {
  res.json(req.article);
};

/**
 * List of Articles
 */
exports.all = function(req, res) {
  var username = req.query.username;
  if (username === undefined) {
    if (req.user === undefined) {
      res.json(404, {});
      return;
    }
    username = req.user.username;
  }
  User.find({'username': username }, function (err, results) {
    if (results.length) {
      Article.find({'user': results[0]._id})
        .sort('-created')
        .populate('user', 'name username')
        .exec(function(err, articles) {
          if (err) {
            return res.json(500, {error: 'Cannot list the articles'});
          }
          res.json(articles);
        });
    }
  });
};
