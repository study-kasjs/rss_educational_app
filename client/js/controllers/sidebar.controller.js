(function () {
	'use strict';
	angular.module('rssreader').controller('SidebarController', ['$scope', '$state', '$log', '$q', 'feedsService', 'articlesService', 'dashboardService', function ($scope, $state, $log, $q, feedsService, articlesService, dashboardService) {
		$scope.feedsList = ['cat'];
		$scope.feedsInnerList = ['feeds'];
		$scope.favsListDragableTypes = ['favs'];
		$scope.currentArticlesType = dashboardService.currentArticlesType;
		$scope.currentSelectedItem;
		$scope.feedsData = feedsService;
		$scope.feeds = $scope.feedsData.feedsDictionary;
		$scope.favs = $scope.feedsData.favouritesDictionary;

		$scope.onFeedsDrag = function (parent, index) {
			dashboardService.displayLoading();
			$scope.feeds[parent].feeds.splice(index, 1);
			feedsService.setInnerFeedsOrder().then(function (res) {
				angular.forEach($scope.feeds, function (value, key) {
					if (!value.feeds.length) {
						feedsService.getAllFeeds();
					}
				});
				return res;
			}, function (err) {
			    console.log(err);
			    return err;
			}).finally(function () {
				dashboardService.hideLoading();
			});
		}

		$scope.onFeedsCatDrag = function (index) {
			dashboardService.displayLoading();
			$scope.feeds.splice(index, 1);
			feedsService.setFeedsOrder().then(function (res) {
			    return res;
			}, function (err) {
			    console.log(err);
			    return err;
			}).finally(function () {
			    dashboardService.hideLoading();
			});
		}

		$scope.onFavsCatDrag = function (index) {
			dashboardService.displayLoading();
			$scope.favs.splice(index, 1);
			feedsService.setFavsOrder().then(function (res) {
			}, function (err) {
			    console.log(err);
			    return err;
			}).finally(function () {
			    dashboardService.hideLoading();
			});
		}

		$scope.IgnoreDoubleClick = function () {
			return false;
		}

		$scope.getAll = function ($event) {
			dashboardService.hideSidebar();
			setArticlesType(angular.element($event.currentTarget).parent(), 'all');
			// if there is only one category and feed, return this feed articles
			if ($scope.feeds.length === 1 && $scope.feeds[0].feeds.length === 1) {
				$state.go('dashboard.' + dashboardService.getViewMode(), { type: 'feed', value1: $scope.feeds[0].feeds[0]._id});
			} else {
				$state.go('dashboard.' + dashboardService.getViewMode(), { type: 'all', value1: '', value2: '' });
			}
		}

		$scope.getByFeed = function ($event, feed) {
			dashboardService.hideSidebar();
			setArticlesType(angular.element($event.currentTarget).parent());
			$state.go('dashboard.' + dashboardService.getViewMode(), { type: 'feed', value1: feed._id, value2: '' });
		}

		$scope.getByCat = function ($event, cat, index) {
			dashboardService.hideSidebar();
			setArticlesType(angular.element($event.currentTarget).parent(), 'category', cat);
			$scope.shevronToggle($event);
			// if there is only one feed within selected category, return its articles
			if ($scope.feeds[arguments[2]].feeds.length == 1) {
				$state.go('dashboard.' + dashboardService.getViewMode(), { type: 'feed', value1: $scope.feeds[arguments[2]].feeds[0]._id });
			} else {
				$state.go('dashboard.' + dashboardService.getViewMode(), { type: 'category', value1: cat });
			}
		}

		$scope.getFavourites = function ($event) {
			setArticlesType(angular.element($event.currentTarget).parent(), 'favourites');
			$scope.shevronToggle($event);
			$state.go('dashboard.' + dashboardService.getViewMode(), { type: 'favourites', value1: '', value2: '' });
		}

		$scope.getFavArticlesByCat = function ($event, cat) {
			setArticlesType(angular.element($event.currentTarget).parent(), 'favourites', cat);
			$scope.shevronToggle($event);
			$state.go('dashboard.' + dashboardService.getViewMode(), { type: 'favourites', value1: 'category', value2: cat });
		}

		$scope.getFavArticle = function ($event, article) {
		    dashboardService.hideSidebar();
			articlesService.articleForRead = article;
			setArticlesType(angular.element($event.currentTarget).parent());
			$state.go('dashboard.article', { feed: article.feed, link: article.link, type: 'favourite'});
		}

		$scope.shevronToggle = function ($event) {
			if ($event.currentTarget.attributes['aria-expanded']) {
				if ($event.currentTarget.attributes['aria-expanded'].value == 'true') {
					angular.element($event.currentTarget).removeClass('chevron-down');
				}
				if ($event.currentTarget.attributes['aria-expanded'].value == 'false') {
					angular.element($event.currentTarget).addClass('chevron-down');
				}
			}
			else {
				angular.element($event.currentTarget).addClass('chevron-down');
			}
		}
		$scope.hideFavourites = function () {
			return feedsService.favouritesDictionary.length;
		}

		$scope.checkIfEmpty = function () {
			return feedsService.feedsDictionary.length;
		}
		$scope.toggle = false;
		$scope.toAddFeed = function () {
			dashboardService.hideSidebar();
			$state.go('dashboard.addFeed', { reload: true });
		}
		var setArticlesType = function (element, type, value) {
			if ($scope.currentSelectedItem) {
				$scope.currentSelectedItem.removeClass('selected');
			}
			if (type === 'category') {
				$scope.currentSelectedItem = element.parent();
			}
			else {
				$scope.currentSelectedItem = element;
			}
			$scope.currentSelectedItem.addClass('selected');
		}
	}]);
})();
