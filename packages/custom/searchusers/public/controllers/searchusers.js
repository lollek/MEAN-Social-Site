'use strict';

angular.module('mean.searchusers').controller('SearchusersController', ['$scope', 'Global', 'Searchusers',
  function($scope, Global, Searchusers) {
    $scope.global = Global;
    $scope.package = {
      name: 'searchusers'
    };
    $scope.result = null;

    $scope.search = function(username) {
    	Searchusers.get({
    		username: $stateParams.username
    	}, function(users) {
    		$scope.result = users;
    	});
    };
  }
]);
