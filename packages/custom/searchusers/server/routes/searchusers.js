'use strict';

var search = require('../controllers/search');

// The Package is past automatically as first parameter
module.exports = function(Searchusers, app, auth, database) {
  app.route('/search/:username')
    .get(search.search);


  app.param('username', search.username);
};
