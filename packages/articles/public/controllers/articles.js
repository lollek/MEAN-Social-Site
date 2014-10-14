'use strict';

angular.module('mean.articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', '$http', 'Global', 'Articles',
  function($scope, $stateParams, $location, $http, Global, Articles) {
    $scope.global = Global;

    $scope.hasAuthorization = function(article) {
      if (!article || !article.user) return false;
      return $scope.global.isAdmin || article.user._id === $scope.global.user._id;
    };

    $scope.isFriend = function() {
      if ($scope.isLoggedIn()) {
        if (window.user.friends.indexOf($scope.getPage()) !== -1)
          return true;
        if (window.user.username == $scope.getPage())
          return true;
      }
      return false;
    };

    $scope.addFriend = function() {
      /*
      $http.get()
        .success(function(data) {
        });
        */
    }

    $scope.create = function(isValid) {
      if (isValid) {
        var article = new Articles({
          content: this.content,
          user: $scope.getPage()
        });
        article.$save();
        $scope.find();
        this.content = '';
      } else {
        $scope.submitted = true;
      }
    };

    $scope.remove = function(article) {
      if (article) {
        article.$remove();

        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function(response) {
          $location.path('articles');
        });
      }
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var article = $scope.article;
        if (!article.updated) {
          article.updated = [];
        }
        article.updated.push(new Date().getTime());

        article.$update(function() {
          $location.path('articles/' + article._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.getPage = function() {
      var userpage = $location.path().split('/user/')[1];
      if ($location.path() === '/user')
        userpage = window.user.username;
      return userpage;
    };

    $scope.find = function() {
      Articles.query({ 'username': $scope.getPage() },function(articles) {
        $scope.articles = articles;
      });
    };

    $scope.findOne = function() {
      Articles.get({
        articleId: $stateParams.articleId
      }, function(article) {
        $scope.article = article;
      });
    };

    $scope.findByUser = function() {
      if ($stateParams.username === null) {
        $stateParams.username = window.user.username;
      }
      Articles.query({
        username: $stateParams.username
      }, function(articles) {
        $scope.articles = articles;
      });
    };
  }
]);
