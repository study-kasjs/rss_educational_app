(function () {
	angular.module('rssreader')
	.factory('transfer', [function () {
		var obj = {}, str = '', providerString = '', email = '';

		function setEmail(data) {
			email = data;
		}
		function getEmail() {
			return email;
		}
		function setProviderString(data) {
			providerString = data;
		}
		function getProviderString() {
			return providerString;
		}
		function setString(data) {
			str = data;
		}
		function getString() {
			return str;
		}
		function setObj(data) {
			obj = data;
		}
		function getObj() {
			return obj;
		}
		return {
			setObj: setObj,
			getObj: getObj,
			setString: setString,
			getString: getString,
			setProviderString: setProviderString,
			getProviderString: getProviderString,
			setEmail: setEmail,
			getEmail: getEmail
		}
	}]);
})();