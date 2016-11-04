angular.module('rssreader').directive('checkStrength', [function() {
	return {
		replace: false,
		restrict: 'EACM',
		scope: {
			myuser: '='
		},
		link: function(scope, iElement, iAttrs) {
			var strength = {
				colors: ['#F00', '#F90', '#FF0', '#9F0', '#0F0'],
				mesureStrength: function(p) {
					if (p) {
						var _force = 0,
							_regex = /[#@$-/:-?-~!"^_`]/g,
							_lowerLetters = /[a-z]+/.test(p),
							_upperLetters = /[A-Z]+/.test(p),
							_numbers = /[0-9]+/.test(p),
							_symbols = _regex.test(p),
							_flags = [_lowerLetters, _upperLetters, _numbers, _symbols],
							_passedMatches = $.grep(_flags, function(el) {
								return el === true;
							}).length;

							_force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
							_force += _passedMatches * 10;

							// penality (short password)
							_force = (p.length <= 5) ? Math.min(_force, 10) : _force;
							// penality (poor variety of characters)
							_force = (_passedMatches == 1) ? Math.min(_force, 10) : _force;
							_force = (_passedMatches == 2) ? Math.min(_force, 20) : _force;
							_force = (_passedMatches == 3) ? Math.min(_force, 40) : _force;

						return _force;

					} else {
						return scope.user.password = '';
					}
				},
				getColor: function(s) {
					var idx = 0;
					if (s <= 10) { idx = 0; } else if (s <= 20) { idx = 1; } else if (s <= 30) { idx = 2; } else if (s <= 40) { idx = 3; } else { idx = 4; }

					return { idx: idx + 1, col: this.colors[idx] };
				}
			};
			scope.$watch("myuser", function() {
				if (!scope.myuser.password && !scope.myuser.pas ) {
					iElement.css({ "display": "none" });
				} else {
					var c = strength.getColor(strength.mesureStrength(scope.myuser.password || scope.myuser.pas));
					iElement.css({ "display": "block" });
					iElement.children('li')
						.css({ "background": "#DDD" })
						.slice(0, c.idx)
						.css({ "background": c.col });
				}
			}, true);
		},
		template: '<li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li>'
	};
}]);