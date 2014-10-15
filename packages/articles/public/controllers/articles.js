'use strict';

angular.module('mean.articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', '$window', '$http', 'Global', 'Articles',
  function($scope, $stateParams, $location, $window, $http, Global, Articles) {
    $scope.global = Global;

    $scope.hasAuthorization = function(article) {
      if (!article || !article.user) return false;
      return $scope.global.isAdmin || article.user._id === $scope.global.user._id || article.author._id === $scope.global.user._id;
    };

    $scope.isLoggedIn = function() {
      window.global = $scope.global;
      return $scope.global.authenticated;
    };

    $scope.isFriend = function() {
      if ($scope.global.user.friends !== undefined) {
        if ($scope.global.user.friends.indexOf($scope.getPage()) !== -1)
          return true;
        if ($scope.global.user.username === $scope.getPage())
          return true;
      }
      return false;
    };

    $scope.addFriend = function() {
      $http.post('/addFriend', {username: $scope.getPage()})
        .success(function(data) {
          $window.location.reload();
        });
    };

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
        for (var i in $scope.articles)
          if ($scope.articles[i] === article)
            $scope.articles.splice(i, 1);

      } else {
        $scope.article.$remove(function(response) {
          $location.path('articles');
        });
      }
    };

    $scope.getPage = function() {
      switch($location.path()) {
        case '/': /* fall through */
        case '/user': /* fall through */
        case '/user/': return window.user.username;
        default: return $location.path().split('/user/')[1];
      }
    };

    $scope.find = function() {
      Articles.query({
        'username': $scope.getPage()
     }, function(articles) {
       $scope.articles = articles;
     });
    }; 
  }
]);
