(function () {
    'use strict';
    angular.module('rssreader').factory('sessionInjector', ['$injector', function ($injector) {
        var sessionInjector = {
            request: function(config) {
                config.timeout = 15000;
                return config;
            },
            responseError: function (res) {
                var $state = $injector.get('$state'),
                $q = $injector.get('$q'),
                authService = $injector.get('authService'),
                dashboardService = $injector.get('dashboardService');
                switch (res.status) {
                    case 404: {
                        $state.go('404', { reload: true });
                    }
                        break;
                    case 403: {
                        authService.logOut();
                        $state.go('home', {reload: true})
                    }
                        break;
                    case -1: {
                        dashboardService.toReload = true;
                    }
                        break;
                }
                return $q.reject(res);
            }
        };
        return sessionInjector;
    }]);
})();