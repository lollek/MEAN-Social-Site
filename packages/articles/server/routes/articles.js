'use strict';

var articles = require('../controllers/articles');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.article.user.id !== req.user.id &&
      req.article.author.id !== req.user.id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

module.exports = function(Articles, app, auth) {

  app.route('/articles')
    .get(articles.all)
    .post(auth.requiresLogin, articles.create);
  app.route('/articles/:articleId')
    .get(articles.show)
    .delete(auth.requiresLogin, hasAuthorization, articles.destroy);
  app.route('/addFriend')
    .post(articles.addFriend);

  // Finish with setting up the articleId param
  app.param('articleId', articles.article);
};
