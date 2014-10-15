'use strict';

(function() {
  // Articles Controller Spec
  describe('MEAN controllers', function() {
    describe('ArticlesController', function() {
      // The $resource service augments the response object with methods for updating and deleting the resource.
      // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
      // the responses exactly. To solve the problem, we use a newly-defined toEqualData Jasmine matcher.
      // When the toEqualData matcher compares two objects, it takes only object properties into
      // account and ignores methods.
      beforeEach(function() {
        this.addMatchers({
          toEqualData: function(expected) {
            return angular.equals(this.actual, expected);
          }
        });
      });

      beforeEach(function() {
        module('mean');
        module('mean.system');
        module('mean.articles');
      });

      // Initialize the controller and a mock scope
      var ArticlesController,
        scope,
        $httpBackend,
        $stateParams,
        $location;

      // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
      // This allows us to inject a service but then attach it to a variable
      // with the same name as the service.
      beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {

        scope = $rootScope.$new();

        ArticlesController = $controller('ArticlesController', {
          $scope: scope
        });

        $stateParams = _$stateParams_;

        $httpBackend = _$httpBackend_;

        $location = _$location_;

      }));

      it('$scope.find() should create an array with at least one article object ' +
        'fetched from XHR', function() {

          // test expected GET request
          $httpBackend.expectGET('articles').respond([{
            title: 'An Article about MEAN',
            content: 'MEAN rocks!'
          }]);

          // run controller
          scope.find();
          $httpBackend.flush();

          // test scope value
          expect(scope.articles).toEqualData([{
            title: 'An Article about MEAN',
            content: 'MEAN rocks!'
          }]);

        });

      it('$scope.create() with valid form data should send a POST request ' +
        'with the form input values', function() {

          // fixture expected POST data
          var postArticleData = function() {
            return {
              content: 'MEAN rocks!'
            };
          };

          // fixture expected response data
          var responseArticleData = function() {
            return {
              _id: '525cf20451979dea2c000001',
              content: 'MEAN rocks!'
            };
          };

          var postJSON = function() {
            return {
              username: 'test'
            };
          };

          var responseJSON = function() {
            return {
              Accept: 'application/json, text/plain, */*'
            };
          };

          // fixture mock form input values
          scope.content = 'MEAN rocks!';

          // test post request is sent
          $httpBackend.expectPOST('articles', postArticleData()).respond(responseArticleData());
          $httpBackend.expectGET('articles', postJSON()).respond(responseJSON());

          // Run controller
          scope.create(true);
          $httpBackend.flush();

          // test form input(s) are reset
          expect(scope.content).toEqual('');

        });

      it('$scope.remove() should send a DELETE request with a valid articleId ' +
        'and remove the article from the scope', inject(function(Articles) {

          // fixture rideshare
          var article = new Articles({
            _id: '525a8422f6d0f87f0e407a33'
          });

          // mock rideshares in scope
          scope.articles = [];
          scope.articles.push(article);

          // test expected rideshare DELETE request
          $httpBackend.expectDELETE(/articles\/([0-9a-fA-F]{24})$/).respond(204);

          // run controller
          scope.remove(article);
          $httpBackend.flush();

          // test after successful delete URL location articles list
          //expect($location.path()).toBe('/articles');
          expect(scope.articles.length).toBe(0);

        }));
    });
  });
}());
