(function () {
    'use strict';
    angular.module('rssreader').factory('authService', ['$http', '$window', '$auth', 'transfer', 'jwtHelper', 'toasterService', 'profileService', function ($http, $window, $auth, transfer, jwtHelper, toasterService, profileService) {
        var auth = {
            saveToken: function (token) {
                $auth.setToken(token);
            },
            getToken: function () {
                return $auth.getToken();
            },
            isLoggedIn: function () {
                return $auth.isAuthenticated();
            },
            currentUser: function () {
                return profileService.refreshProfileData().email;
            },
            userID: function () {
                if (auth.isLoggedIn()) {
                    var payload = $auth.getPayload();
                    return payload.sub;
                }
            },
            register: function (user) {
                return $http.post('/register', user).success(function (data) {
                    auth.saveToken(data.token);
                }).error(function (err) {
                    console.log(err.message);
                })
            },
            forgot: function (confirm_email) {
                return $http.post('/forgot', confirm_email).success(function (data) {
                }).error(function (err) {
                    console.log(err.message);
                })

            },
            reset: function (password) {
                return $http.post('/reset/:token', password).success(function (data) {
                }).error(function (err) {
                    console.log(err.message);
                })
            },
            logIn: function (user) {
                return $http.post('/login', user).success(function (data) {
                    auth.saveToken(data.token);
                }).error(function (err) {
                    console.log(err.message);
                });
            },
            logOut: function () {
                $auth.removeToken();
                $auth.logout();
            }
        }
        return auth;
    }]);
})();
