(function() {
	'use strict';
	angular.module('rssreader')
		.factory('profileService', ['$window', 'Upload', 'accountInfo', '$auth',
			function($window, Upload, accountInfo, $auth) {
				var obj = {
					profile: {},
					getProfile: function() {
						if ($auth.isAuthenticated()) {
							return accountInfo.getProfile().then(function(response) {
								var length = response.data.user.length;
								for (var i = 0; i < length; i++) {
									if (response.data.user[i].email === $auth.getPayload().email) {
										obj.profile = response.data.user[i];
									}
								}
							});
						}
					},
					refreshProfileData: function() {
						return obj.profile;
					}
				}
				return obj;
			}
		]);
})();

