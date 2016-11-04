describe('ProfileController', function () {
	beforeEach(angular.mock.module('rssreader'));
	var $controller, $httpBackend, $scope, profileService,
		token = {
			token : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1N2QzYzM1MzU2NTc2M2FjM2M3OWY3YmUiLCJlbWFpbCI6ImdlbXluaTg1QGdtYWlsLmNvbSIsImlhdCI6MTQ3MzUwOTg5NCwiZXhwIjoxNDczNTk2Mjk0fQ.OSLhxRYB97SwgVnKCIzdolHB8jR1lEUEc8Rxji7TaIE"
		};

	beforeEach(angular.mock.inject(function (_$controller_) {
		$controller = _$controller_;
		
	}));
	describe('change password' , function () {
		it('should exist ProfileController', function () {
			var $scope = {};
			var controller = $controller('ProfileController', { $scope: $scope });
			expect($scope.newUserData).toBeDefined();
			expect($scope.currentUser).toBeDefined();
		});
	});
	describe('http test request to /changePassword', function() {
		beforeEach(inject(function(_$controller_, _$httpBackend_, _profileService_) {
			$controller = _$controller_;
			$scope = {};
			$httpBackend = _$httpBackend_;
			profileService = _profileService_;
		}));
		it('should get success response from server with token', inject(function ($http) {
			var ProfileController = $controller('ProfileController', { $scope: $scope });
			$http.post('/changePassword', {
				email: 'gemyni85@gmail.com',
				currentPass: "987654321aA!",
				newPass: "123456789aA!",
				newPassRepeat: "123456789aA!"
			}).success(function (data, status, headers, config) {
				$scope.errorMsg = undefined;
				$scope.response = data;
				$scope.status = status;	
			}).error(function(){
				$scope.errorMsg = 'error message';
			});
		
			$httpBackend.expect('GET', './partials/home.html').respond(200);
			$httpBackend.whenGET("/translation/locale-en.json").respond(200);
			$httpBackend.when('POST', '/changePassword').respond(200, { token : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1N2QzYzM1MzU2NTc2M2FjM2M3OWY3YmUiLCJlbWFpbCI6ImdlbXluaTg1QGdtYWlsLmNvbSIsImlhdCI6MTQ3MzUwOTg5NCwiZXhwIjoxNDczNTk2Mjk0fQ.OSLhxRYB97SwgVnKCIzdolHB8jR1lEUEc8Rxji7TaIE"});
			$httpBackend.when('POST', '/changePas').respond(404, { error : "msg error"});
			expect($httpBackend.flush).not.toThrow();
			expect($scope.errorMsg).toEqual(undefined);
			expect($scope.response).toEqual(token);
			expect($scope.status).toEqual(200);
			expect($scope.currentUser).toBeDefined();
			expect(profileService).toBeDefined();
		}));	
	});
});