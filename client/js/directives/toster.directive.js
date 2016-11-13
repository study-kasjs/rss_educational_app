angular.module('rssreader').directive('toaster', ['$timeout', 'toasterService', function ($timeout, toasterService) {
	return {
		restrict: 'E',
		transclude: true,
		link: function (scope, element, attrs) { 
			if (attrs.overlay) {
				scope.overlay = true;
			}
			else {
				scope.overlay = false;
			}
			if (attrs.delay) {
				scope.delay = attrs.delay;
			}
			else {
				scope.delay = 3000;
			}
			scope.toasterStyle = {};
			scope.confirm = function () {
				scope.$parent[attrs.confirm]();
				scope.hideToaster();
			}
			scope.reject = function () {
				scope.hideToaster();
			}
			scope.hideToaster = function () {
				$timeout.cancel(scope.timer);
				scope.$destroy();
				toasterService.removeToaster(element);
			};
			scope.timer = $timeout(function () {
				scope.hideToaster();
			}, scope.delay);
		},
		templateUrl: '../partials/modals/toaster.html'
	};
}]);