'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', '$location', 'Global',
  function($scope, $location, Global) {
    $scope.global = Global;

    $scope.reload = function() {
      if ($scope.global.authenticated) {
        $location.path('user/' + $scope.global.user.username);
      }
    };
  }
]);
