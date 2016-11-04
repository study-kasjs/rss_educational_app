(function () {
	'use strict';
	angular.module('rssreader').service('toasterService', ['$rootScope', '$compile', '$animate', function ($rootScope, $compile, $animate) {
		var domParent = angular.element('body');

		//********************************************************************************
		//  You can pass custom options to toaster methods as second parameter
		//  options properties:
		//  message: string
		//  overlay: boolean
		//  delay: value (ms)
		//  position: [left, right, left-bottom, right-bottom]
		//  type: one of ['toaster-default', 'toaster-success', 'toaster-info', 'toaster-error']
		//  iconClass: string (name of glyph class, ex: fa fa-info)
		//  confirm: Function (callback that will ba called if user confirm toaster action)
		// 
		//********************************************************************************

		var buildToaster = function (options, scope, onShow) {
			var callback = arguments[2],
				elem = angular.element(document.createElement("toaster"));
			elem.addClass('toaster-wrapper');
			elem.addClass(options.type);
			if (options.overlay) {
				elem.attr("overlay", options.overlay);
			}

			if (options.delay) {
				elem.attr("delay", options.delay);
			}

			if (options.confirm) {
				elem.attr("confirm", options.confirm);
			}
			var icon = angular.element(document.createElement("div"));
			icon.addClass('toaster-icon');
			icon.addClass(options.iconClass);
			elem.append(icon);

			elem.append("<span>" + options.message + "</span>");
			if (options.htmlContent) {
				elem.append("<span>" + options.htmlContent + "</span>");
			}
			var appendHtml;
			if (typeof arguments[1] === 'object') {
				appendHtml = $compile(elem, scope)(scope.$new());
			}
			else {
				appendHtml = $compile(elem, scope)($rootScope.$new());
			}
			$animate.enter(appendHtml, domParent).then(function () {
				if (typeof callback === 'function') {
					onShow();
				}
			});
		}
		this.success = function (message, customOptions, scope, onShow) {
			var defaultOptions = {
				message: message,
				type: 'toaster-success',
				iconClass: 'fa fa-check',
				delay: 3000
			},
			options;
			if (typeof customOptions === 'object') {
				options = angular.extend({}, defaultOptions, customOptions);
			}
			else {
				options = defaultOptions;
			}
			buildToaster(options, scope, onShow);
		}
		this.info = function (message, customOptions, scope, onShow) {
			var defaultOptions = {
				message: message,
				type: 'toaster-info',
				iconClass: 'fa fa-info',
				delay: 3000
			},
			options;
			if (typeof arguments[1] === 'object') {
				options = angular.extend({}, defaultOptions, customOptions);
			}
			else {
				options = defaultOptions;
			}
			buildToaster(options, scope, onShow);
		}
		this.error = function (message, customOptions, scope, onShow) {
			var defaultOptions = {
				message: message,
				type: 'toaster-error',
				iconClass: 'fa fa-exclamation-triangle',
				delay: 3000
			},
			options;
			if (typeof arguments[1] === 'object') {
				options = angular.extend({}, defaultOptions, customOptions);
			}
			else {
				options = defaultOptions;
			}
			buildToaster(options, scope, onShow);
		}
		this.custom = function (customOptions, scope, onShow) {
			var defaultOptions = {
				message: message,
				type: 'toaster-default',
				overlay: true,
				iconClass: 'fa fa-info',
			},
			options;
			if (typeof arguments[0] === 'object') {
				options = angular.extend({}, defaultOptions, customOptions);
			}
			else {
				options = defaultOptions;
			}
			buildToaster(options, scope, onShow);
		}
		this.confirm = function (customOptions, scope, onShow) {
			var defaultOptions = {
				message: 'Confirm?',
				type: 'toaster-default',
				overlay: true,
				iconClass: 'fa fa-question',
				htmlContent: "<button class='app-btn-toaster-red' aria-label='Justify' ng-click='confirm()'>yes</button><button class='app-btn-toaster' aria-label='Justify' ng-click='reject()'>no</button>"
			},
			options;
			if (typeof customOptions === 'object') {
				options = angular.extend({}, defaultOptions, customOptions);
			}
			else {
				options = defaultOptions;
			}
			buildToaster(options, scope, onShow);
		}
		this.removeToaster = function (element) {
			$animate.leave(element, domParent).then(function () {
			});
		}
	}]);
})();