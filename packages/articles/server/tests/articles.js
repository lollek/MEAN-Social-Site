'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Article = mongoose.model('Article'),
  controller = require('../../server-cov/controllers/articles');

/**
 * Globals
 */
var user;
var article;


/**
 * Create a random hex string of specific length and
 * @todo consider taking out to a common unit testing javascript helper
 * @return string
 */
function getRandomString(len) {
  var crypto = require('crypto');
  if (!len)
    len = 16;

  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex');
}



/**
 * Test Suites
 */
describe('<Unit Test>', function() {
  describe('Model Article:', function() {
    beforeEach(function(done) {
      user = new User({
        name: 'Full name',
        email: 'test@test.com',
        username: 'user',
        password: 'password',
        friends: []
      });

      user.save(function() {
        article = new Article({
          content: 'Article Content',
          user: user,
          author: user
        });

        done();
      });
    });

    describe('Method Save', function() {
      it('should be able to save without problems', function(done) {
        return article.save(function(err) {
          should.not.exist(err);
          article.content.should.equal('Article Content');
          article.user.should.not.have.length(0);
          article.author.should.not.have.length(0);
          article.created.should.not.have.length(0);
          done();
        });
      });

      it('should be able to show an error when try to save without content', function(done) {
        article.content = '';

        return article.save(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should be able to show an error when try to save without user', function(done) {
        article.user = {};

        return article.save(function(err) {
          should.exist(err);
          done();
        });
      });


      it('should be able to show an error when try to save without author', function(done) {
        article.author = {};

        return article.save(function(err) {
          should.exist(err);
          done();
        });
      });

    });

    afterEach(function(done) {
      article.remove();
      user.remove();
      done();
    });
  });

  describe('Controller Article:', function() {
    it('Should be possible to add user as friend', function(done) {
      var user1 = {
        name: 'Full name',
        email: 'test' + getRandomString() + '@test.com',
        username: getRandomString(),
        password: 'password',
        provider: 'local'
      };

      var user2 = {
        name: 'Full name',
        email: 'test' + getRandomString() + '@test.com',
        username: getRandomString(),
        password: 'password',
        provider: 'local'
      };

      var _user1 = new User(user1);
      var _user2 = new User(user2);

      var req = {
        user: _user1,
        body: _user2
      };

      var res = {
        first: undefined,
        second: undefined,
        json: function(first, second) {
          this.first = first;
          this.second = second;
        }
      };

      _user1.save(function(err) {
        should.not.exist(err);
        _user2.save(function(err) {
          should.not.exist(err);
          controller.addFriend(req, res);
          res.first.should.equal(req.user);

          _user1.remove();
          _user2.remove();
          done();
        });
      });

    });
  });
});
