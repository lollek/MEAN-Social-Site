'use strict';

var crypto = require('crypto');
var request = require('request');

/**
 * Create a random hex string of specific length and
 * @todo consider taking out to a common unit testing javascript helper
 * @return string
 */
function getRandomString(len) {
  if (!len)
    len = 16;

  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex');
}

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

/**
 * Globals
 */
var user1, user2;
var testuser;

/**
 * Test Suites
 */
describe('<Unit Test>', function() {
  describe('Model User:', function() {

    before(function(done) {
      user1 = {
        name: 'Full name',
        email: 'test' + getRandomString() + '@test.com',
        username: getRandomString(),
        password: 'password',
        provider: 'local'
      };

      user2 = {
        name: 'Full name',
        email: 'test' + getRandomString() + '@test.com',
        username: getRandomString(),
        password: 'password',
        provider: 'local'
      };

      done();
    });

    describe('Method Save', function() {
      it('should begin without the test user', function(done) {
        User.find({
          email: user1.email
        }, function(err, users) {
          users.should.have.length(0);

          User.find({
            email: user2.email
          }, function(err, users) {
            users.should.have.length(0);
            done();
          });

        });
      });

      it('should be able to save without problems', function(done) {

        var _user = new User(user1);
        _user.save(function(err) {
          should.not.exist(err);
          _user.remove();
          done();
        });

      });

      it('should check that roles are assigned and created properly', function(done) {

        var _user = new User(user1);
        _user.save(function(err) {
          should.not.exist(err);

          // the user1 object and users in general are created with only the 'authenticated' role
          _user.hasRole('authenticated').should.equal(true);
          _user.hasRole('admin').should.equal(false);
          _user.isAdmin().should.equal(false);
          _user.roles.should.have.length(1);
          _user.remove(function(err) {
            done();
          });
        });

      });

      it('should confirm that password is hashed correctly', function(done) {

        var _user = new User(user1);

        _user.save(function(err) {
          should.not.exist(err);
          _user.hashed_password.should.not.have.length(0);
          _user.salt.should.not.have.length(0);
          _user.authenticate(user1.password).should.equal(true);
          _user.remove(function(err) {
            done();
          });

        });
      });

      it('should be able to create user and save user for updates without problems', function(done) {

        var _user = new User(user1);
        _user.save(function(err) {
          should.not.exist(err);

          _user.name = 'Full name2';
          _user.save(function(err) {
            should.not.exist(err);
            _user.name.should.equal('Full name2');
            _user.remove(function() {
              done();
            });
          });

        });

      });

      it('should fail to save an existing user with the same values', function(done) {

        var _user1 = new User(user1);
        _user1.save();

        var _user2 = new User(user1);

        return _user2.save(function(err) {
          should.exist(err);
          _user1.remove(function() {

            if (!err) {
              _user2.remove(function() {
                done();
              });
            }

            done();

          });

        });
      });

      it('should show an error when try to save without name', function(done) {

        var _user = new User(user1);
        _user.name = '';

        return _user.save(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should show an error when try to save without username', function(done) {

        var _user = new User(user1);
        _user.username = '';

        return _user.save(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should show an error when try to save without password and provider set to local', function(done) {

        var _user = new User(user1);
        _user.password = '';
        _user.provider = 'local';

        return _user.save(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should be able to to save without password and provider set to twitter', function(done) {

        var _user = new User(user1);

        _user.password = '';
        _user.provider = 'twitter';

        return _user.save(function(err) {
          _user.remove(function() {
            should.not.exist(err);
            _user.provider.should.equal('twitter');
            _user.hashed_password.should.have.length(0);
            done();
          });
        });
      });

    });

    // source: http://en.wikipedia.org/wiki/Email_address
    describe('Test Email Validations', function() {
      it('Shouldnt allow invalid emails #1', function(done) {
        var _user = new User(user1);
        _user.email = 'Abc.example.com';
        _user.save(function(err) {
          if (!err) {
            _user.remove(function() {
              should.exist(err);
              done();
            });
          } else {
            should.exist(err);
            done();
          }
        });
      });

      it('Shouldnt allow invalid emails #2', function(done) {
        var _user = new User(user1);
        _user.email = 'A@b@c@example.com';
        _user.save(function(err) {
          if (err) {
            should.exist(err);
            done();
          } else {
            _user.remove(function(err2) {
              should.exist(err);
              done();
            });
          }
        });
      });

      it('Shouldnt allow invalid emails #3', function(done) {
        var _user = new User(user1);
        _user.email = 'a"b(c)d,e:f;g<h>i[j\\k]l@example.com';
        _user.save(function(err) {
          if (!err) {
            _user.remove(function() {
              should.exist(err);
              done();
            });
          } else {
            should.exist(err);
            done();
          }
        });
      });

      it('Shouldnt allow invalid emails #4', function(done) {
        var _user = new User(user1);
        _user.email = 'just"not"right@example.com';
        _user.save(function(err) {
          if (!err) {
            _user.remove(function() {
              should.exist(err);
              done();
            });
          } else {
            should.exist(err);
            done();
          }
        });
      });

      it('Shouldnt allow invalid emails #5', function(done) {
        var _user = new User(user1);
        _user.email = 'this is"not\\allowed@example.com';
        _user.save(function(err) {
          if (!err) {
            _user.remove(function() {
              should.exist(err);
              done();
            });
          } else {
            should.exist(err);
            done();
          }
        });
      });

      it('Shouldnt allow invalid emails #6', function(done) {
        var _user = new User(user1);
        _user.email = 'this\\ still\\"not\\allowed@example.com';
        _user.save(function(err) {
          if (!err) {
            _user.remove(function() {
              should.exist(err);
              done();
            });
          } else {
            should.exist(err);
            done();
          }
        });
      });

      it('Shouldnt allow invalid emails #7', function(done) {
        var _user = new User(user1);
        _user.email = 'john..doe@example.com';
        _user.save(function(err) {
          if (!err) {
            _user.remove(function() {
              should.exist(err);
              done();
            });
          } else {
            should.exist(err);
            done();
          }
        });
      });

      it('Shouldnt allow invalid emails #8', function(done) {
        var _user = new User(user1);
        _user.email = 'john.doe@example..com';
        _user.save(function(err) {
          if (!err) {
            _user.remove(function() {
              should.exist(err);
              done();
            });
          } else {
            should.exist(err);
            done();
          }
        });
      });

      it('Should save with valid email #1', function(done) {
        var _user = new User(user1);
        _user.email = 'john.doe@example.com';
        _user.save(function(err) {
          if (!err) {
            _user.remove(function() {
              should.not.exist(err);
              done();
            });
          } else {
            should.not.exist(err);
            done();
          }
        });
      });

      it('Should save with valid email #2', function(done) {
        var _user = new User(user1);
        _user.email = 'disposable.style.email.with+symbol@example.com';
        _user.save(function(err) {
          if (!err) {
            _user.remove(function() {
              should.not.exist(err);
              done();
            });
          } else {
            should.not.exist(err);
            done();
          }
        });
      });

      it('Should save with valid email #3', function(done) {
        var _user = new User(user1);
        _user.email = 'other.email-with-dash@example.com';
        _user.save(function(err) {
          if (!err) {
            _user.remove(function() {
              should.not.exist(err);
              done();
            });
          } else {
            should.not.exist(err);
            done();
          }
        });
      });
  });
    after(function(done) {

      /** Clean up user objects
       * un-necessary as they are cleaned up in each test but kept here
       * for educational purposes
       *
       *  var _user1 = new User(user1);
       *  var _user2 = new User(user2);
       *
       *  _user1.remove();
       *  _user2.remove();
       */

      done();
    });
  });

  describe('Controller User:', function() {
    it('Should NOT be possible to create a user with no username', function(done) {
      testuser = user1;
      testuser.email = 'test' + getRandomString() + '@test.com';
      testuser.username = '';
      testuser.confirmPassword = testuser.password;

      request.post({
        url: 'http://localhost:3000/register',
        body: testuser,
        json: true
      }, function(err, res) {
          res.statusCode.should.equal(400);
          done();
      });

      testuser.username = getRandomString();
    });

    it('Should NOT be possible to create a user with no name', function(done) {
      testuser.name = '';

      request.post({
        url: 'http://localhost:3000/register',
        body: testuser,
        json: true
      }, function(err, res) {
          res.statusCode.should.equal(400);
          done();
      });

      testuser.name = 'Steve';
    });

    it('Should NOT be possible to create a user with mismatching passwords', function(done) {
      testuser.password = 'steve';

      request.post({
        url: 'http://localhost:3000/register',
        body: testuser,
        json: true
      }, function(err, res) {
          res.statusCode.should.equal(400);
          done();
      });

      testuser.password = 'password';
    });

    it('Should be possible to create a user', function(done) {
      request.post({
        url: 'http://localhost:3000/register',
        body: testuser,
        json: true
      }, function(err, res) {
          should.not.exist(err);
          res.statusCode.should.not.equal(400);
          done();
      });
    });

    it('Should be able to login with that user', function(done) {
      request.post({
        url: 'http://localhost:3000/login',
        body: testuser,
        json: true
      }, function(err, res) {
          should.not.exist(err);
          res.statusCode.should.not.equal(400);
          done();
      });
    });

    it('Should NOT be able to login with a bad user', function(done) {
      var tmptest = testuser;
      tmptest.email = 'mailaddr_that_does_not_exist@test.se';
      request.post({
        url: 'http://localhost:3000/login',
        body: tmptest,
        json: true
      }, function(err, res) {
          res.body.should.equal('Unauthorized');
          res.statusCode.should.equal(401);
          done();
      });
    });


    it('Should be possible to search for users', function(done) {
      request.get({
        url: 'http://localhost:3000/search/' + testuser.name
      }, function(err, res) {
          res.body.should.not.equal('[]');
          done();
      });
    });

    it('Should NOT be possible to search for nonexistant users', function(done) {
      request.get({
        url: 'http://localhost:3000/search/pokasdpoaksdpok'
      }, function(err, res) {
          res.body.should.equal('[]');
          done();
      });
    });

  });
});
