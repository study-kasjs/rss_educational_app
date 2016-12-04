'use strict'
angular.module('rssreader', [])
    .controller('feedCtrl', ['$scope', 'feedService', function($scope, feedService) {
        $scope.getFeedArticle = function() {
            feedService.getParsedFeed($scope.feedLink);
        }
    }])
    .factory('feedService',['$http', 'transfer', function($http, transfer) {
        function getParsedFeed(url) {
            return $http.jsonp('https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url)).
            then(function(response) {
                console.log(response.data);
            });
        }
        return {
            getParsedFeed : getParsedFeed
        }
    }]);
