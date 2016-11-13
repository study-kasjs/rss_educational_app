angular.module('rssreader').directive('pwCheck', [function() {
		return {
			require: 'ngModel',
			link: function(scope, elem, attrs, ctrl) {
				var firstPassword = '#' + attrs.pwCheck;
				elem.add(firstPassword).on('keyup', function() {
					scope.$apply(function() {
						if (elem.val() === "") {
							angular.element('span.msg-error').addClass('error-hidden');
						}else{
							angular.element('span.msg-error').removeClass('error-hidden');
						}
						var v = elem.val() === $(firstPassword).val();
						ctrl.$setValidity('pwmatch', v);
					});
				});
			}
		}
	}]);