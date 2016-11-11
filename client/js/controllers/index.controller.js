(function () {
	angular.module('rssreader').controller('IndexController', ['$scope', '$state', '$timeout', 'profileService', 'dashboardService', 'authService', '$window', function ($scope, $state, $timeout, profileService, dashboardService, authService, $window) {
		$scope.loadingIcon = dashboardService.isLoading;
		$scope.isReload = dashboardService.isReload;
		$scope.reloadMsg = 'It takes to long to load';
		$scope.reload = function ($event) {
		    angular.element($event.currentTarget).addClass('reload-spin');
			$timeout(function () {
				angular.element($event.currentTarget).removeClass('reload-spin');
			}, 1000);
			dashboardService.toReload = false;
			$state.reload();
		}
		// $scope.getTheme = function () {
		// 	if (authService.isLoggedIn()) {
		// 		return profileService.refreshProfileData().colorTheme;
		// 	} else {
		// 		return "theme1";
		// 	}
		// }

		$scope.fadeIn = function ($el) {
			$el.removeClass('not-visible');
			$el.addClass('fade-in-1s');
		}

		$scope.slideFromLeft = function ($el) {
			$el.removeClass('not-visible');
			$el.addClass('slide-from-left-smooth');
		}

		$scope.slideFromRight = function ($el) {
			$el.removeClass('not-visible');
			$el.addClass('slide-from-right-smooth');
		}
	}]);
})();
