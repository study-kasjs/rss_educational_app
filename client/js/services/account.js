(function () {
	'use strict';
	angular.module('rssreader')
	.factory('accountInfo', ['$http', function ($http) {
		return {
			getProfile: function () {
				return $http.get('/api/me');
			},
			updateProfile: function (profileData) {
				return $http.put('/api/me', profileData);
			}
		};
	}]);
})();