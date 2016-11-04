(function() {
	'use strict';
	angular.module('rssreader').factory('themeService', ['$http', 'authService', '$window',
		function($http, authService, $window) {
			var thm = {
				layouts: [{
					name: 'Blue',
					url: 'theme1',
					src: 'assets/images/theme1.jpg'
				}, {
					name: 'Black',
					url: 'theme2',
					src: 'assets/images/theme2.jpg'
				}, {
					name: 'Grey',
					url: 'theme3',
					src: 'assets/images/theme3.jpg'
				}, {
					name: 'Black',
					url: 'theme4',
					src: 'assets/images/theme4.jpg'
				},],
				changeTheme: function(theme) {
					return $http.post("/changeColorTheme", {
						colorTheme: theme
					}, {
						headers: {
							Authorization: 'Bearer ' + authService.getToken()
						}
					});
				}
			}
			return thm;
		}
	]);
})();