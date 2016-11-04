describe('authService', function () {

	beforeEach(angular.mock.module('rssreader'));
	beforeEach(angular.mock.inject(function (_authService_, _$q_, _$httpBackend_) {
		authService = _authService_;
		$q = _$q_;
		$httpBackend = _$httpBackend_;
	}));
	it('should create a new user and return token', inject(function ($http) {

		var $scope = {};
		$scope.user = {
			email: "test222@gmail.com",
			password: "123456789aA!",
			repPassword: "123456789aA!"
		};

		
		$http.post('/register', $scope.user)
			.success(function (data, status, headers, config) {
				if (status === 200) {
					$scope.data = data;
					$scope.tokenValue = headers('token');
				}
			})
			.error(function (data, status, headers, config) {
				$scope.valid = false;
			});
		
		$httpBackend.expect('GET', './partials/home.html').respond(200);
		$httpBackend.whenGET("/translation/locale-en.json").respond(200);
		$httpBackend.when('POST', '/register', $scope.user).respond(200, {
			data: $scope.user
		}, {
			token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1N2MzM2YzOWMxMTE1MjA0MTJmMGJlZWUiLCJlbWFpbCI6InRlc3QyMjJAZ21haWwuY3BtIiwiaWF0IjoxNDcyNDEzNDk4LCJleHAiOjE0NzMyNzc0OTh9.AJv8vuhoO5I1XFwX821PyBDfgKxxYIO3LBn3Z638lnY"
		});

		$httpBackend.flush();
		expect($scope.data.data).toEqual({
			email: "test222@gmail.com",
			password: "123456789aA!",
			repPassword: "123456789aA!"
		});
		expect($scope.tokenValue).toEqual("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1N2MzM2YzOWMxMTE1MjA0MTJmMGJlZWUiLCJlbWFpbCI6InRlc3QyMjJAZ21haWwuY3BtIiwiaWF0IjoxNDcyNDEzNDk4LCJleHAiOjE0NzMyNzc0OTh9.AJv8vuhoO5I1XFwX821PyBDfgKxxYIO3LBn3Z638lnY");

	}));
});