'use strict';

// The Package is past automatically as first parameter
module.exports = function(Newapp, app, auth, database) {

  app.get('/newapp/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/newapp/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/newapp/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/newapp/example/render', function(req, res, next) {
    Newapp.render('index', {
      package: 'newapp'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
