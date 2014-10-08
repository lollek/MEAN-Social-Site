'use strict';

angular.module('mean.newapp').controller('NewappController', ['$scope', 'Global', 'Newapp',
  function($scope, Global, Newapp) {
    $scope.global = Global;
    $scope.package = {
      name: 'newapp'
    };
  }
]);
