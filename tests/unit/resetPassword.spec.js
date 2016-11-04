describe('AuthController', function () {
	beforeEach(angular.mock.module('rssreader'));
	var $controller, $httpBackend, $scope, confirm_email,
	html = {
		html :  "<html ng-app='rssreader'></html>"
	};
	beforeEach(angular.mock.inject(function (_$controller_) {
		$controller = _$controller_;
		
	}));
	describe('change password and forgot' , function () {
		it('should exist AuthController', function () {
			var $scope = {};
			var controller = $controller('AuthController', { $scope: $scope });
			expect($scope.forgot).toBeDefined();
			expect($scope.reset).toBeDefined();
			expect($scope.confirm_email).toBeDefined();
			expect($scope.password).toBeDefined();
			expect($scope.error).toBe(undefined);
		});
	});
	describe('http test request to /frogot and /reset', function() {
		beforeEach(inject(function(_$controller_, _$httpBackend_) {
			$controller = _$controller_;
			$scope = {};
			$httpBackend = _$httpBackend_;
		}));
		it('should get success response from server with html page', inject(function ($http) {
			var AuthController = $controller('AuthController', { $scope: $scope });
			$scope.confirm_email = {};
			$http.post('/forgot', { 
				confirm_email : "test@test.com"
			}).success(function (data, status, headers, config) {
				$scope.error = undefined;
				$scope.responseForgot = data;
				$scope.statusFrogot = status;	
			}).error(function (data, status, headers, config) {
				$scope.error = 'error message';
			})
			$http.post('/reset', {
				verifyEmail : true, 
				pas : "741852963aA!",
				confirm : "741852963aA!",
			}).success(function (data, status, headers, config) {
				$scope.responseReset = data;
				$scope.statusReset = status;	
			}).error(function (data, status, headers, config) {

			});
		
			$httpBackend.expect('GET', './partials/home.html').respond(200);
			$httpBackend.whenGET("/translation/locale-en.json").respond(200);
			$httpBackend.when('POST', '/forgot').respond(200,{html : "<html ng-app='rssreader'></html>"});
			$httpBackend.when('POST', '/reset').respond(200,{html : "<html ng-app='rssreader'></html>"});
			expect($httpBackend.flush).not.toThrow();
			expect($scope.responseForgot).toEqual(html);
			expect($scope.responseReset).toEqual(html);
			expect($scope.error).toBe(undefined);
			
		}));	
	});
});