describe('AuthController', function () {
	beforeEach(angular.mock.module('rssreader'));
	var $controller, $httpBackend, $scope,
	errorMsg = {
		message : "First you have to approve you email. We are send verification link to your email"	
	};
	beforeEach(angular.mock.inject(function (_$controller_) {
		$controller = _$controller_;
		
	}));
	describe('Approving email adress' , function () {
		it('should exist AuthController', function () {
			var $scope = {};
			var controller = $controller('AuthController', { $scope: $scope });
			expect($scope.register).toBeDefined();
			expect($scope.error).toBe(undefined);
		});
	});
	describe('http test request to /register', function() {
		beforeEach(inject(function(_$controller_, _$httpBackend_) {
			$controller = _$controller_;
			$scope = {};
			$httpBackend = _$httpBackend_;
		}));
		it('should get success response from server with message that begins at "First"', inject(function ($http) {
			var AuthController = $controller('AuthController', { $scope: $scope });
			$http.post('/reset', {
				email: "gemyni85@gmail.com",
				password: "123456789aA!",
				repPassword: "123456789aA!",
				verifyEmail: ""
			}).success(function (data, status, headers, config) {
				$scope.response = data;
					
			}).error(function (data, status, headers, config) {
				$scope.errorMsg = data;
			})
		
			$httpBackend.expect('GET', './partials/home.html').respond(200);
			$httpBackend.whenGET("/translation/locale-en.json").respond(200);
			$httpBackend.when('POST', '/reset').respond(400,{message : "First you have to approve you email. We are send verification link to your email"});
			expect($httpBackend.flush).not.toThrow();
			expect($scope.errorMsg).toEqual(errorMsg);
			expect($scope.response).toBe(undefined);
		}));	
	});
});