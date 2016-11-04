(function () {
	'use strict';
	angular.module('rssreader').controller('NavbarController', ['$scope', '$state','profileService', 'authService', 'dashboardService', 'transfer', 'accountInfo', '$auth', '$translate', '$rootScope', '$window', '$translateLocalStorage',
		function ($scope, $state,profileService, authService, dashboardService, transfer, accountInfo, $auth, $translate, $rootScope, $window, $translateLocalStorage) {
			$scope.isLoggedIn = authService.isLoggedIn;
			$scope.isDashboard = function () {
				return /dashboard/.test($state.current.name);
			}
			$scope.currentUser = profileService.refreshProfileData;
			$scope.toggleSidebar = function () {
				$scope.hideMobileNavbar();
				dashboardService.sidebar = !dashboardService.sidebar;
				$scope.getProfile();
			}

			$scope.hideSidebar = function () {
				dashboardService.sidebar = false;
			}

			$scope.hideMobileNavbar = function () {
				angular.element(document.querySelector("#bs-example-navbar-collapse-1")).removeClass('in');
			}

			$scope.toProfile = function () {
				$scope.hideMobileNavbar();
				$scope.hideSidebar();
				$state.go("dashboard.profile");
			}

			$scope.logOut = function () {
				$scope.hideMobileNavbar();
				authService.logOut();
				$state.go("home");
			}

			$scope.onEmblem = function () {
				$scope.hideMobileNavbar();
				if (authService.isLoggedIn()) {
					$state.go("dashboard." + dashboardService.getViewMode(), { type: 'all' });
				} else {
					$state.go("home");
				}
			}
			$scope.goToProgile = function () {
				$state.go("profile");
				$scope.hideMobileNavbar();
			}
			$scope.getProfile = function () {
				accountInfo.getProfile().then(function (response) {
					if ($auth.isAuthenticated()) {
						var lenght = response.data.user.length;
						for (var i = 0; i < lenght; i++) {
							if (response.data.user[i].email === $auth.getPayload().email) {
								$scope.profile = response.data.user[i];
							}
						}
					}
				})
			};
			$scope.getProfile();
			$scope.getImage = function(){
				return profileService.getImage();
			};

			$scope.changeLanguage = function (langKey) {
				$translate.use(langKey);
			}
			$scope.getLangTitle = function () {
				return $scope.langTitle = $window.localStorage.getItem('NG_TRANSLATE_LANG_KEY');
			}

			$rootScope.$on('$translateChangeSuccess', function(event, data) {
      			var language = data.language;
      			$rootScope.lang = language;
				$rootScope.default_direction = language === 'en' ? 'rtl' : 'ltr';
      			$rootScope.default_float = language === 'en' ? 'right' : 'left';
    		});
	}]);
})();