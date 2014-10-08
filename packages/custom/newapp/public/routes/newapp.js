'use strict';

angular.module('mean.newapp').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('newapp example page', {
      url: '/newapp/example',
      templateUrl: 'newapp/views/index.html'
    });
  }
]);
