'use strict';

angular.module('mean.searchusers').config(['$stateProvider',
  function($stateProvider) {

	var checkLoggedin = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') $timeout(deferred.resolve);

        // Not Authenticated
        else {
          $timeout(deferred.reject);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

    $stateProvider
    	.state('search for users', {
    	  url: '/search/',
      	  templateUrl: 'searchusers/views/index.html',
      	  resolve: {
            loggedin: checkLoggedin
          }
    	});
    }
]);
