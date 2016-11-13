(function () {
	'use strict';
	angular.module('rssreader').controller('FeedsController', ['$scope', '$state', '$stateParams', 'Upload', '$http', 'toasterService', 'feedsService', 'dashboardService', 'articlesService', 'authService', 'profileService', function ($scope, $state, $stateParams, Upload, $http, toasterService, feedsService, dashboardService, articlesService, authService, profileService) {
		var changeCatObj = {};

		$scope.advicedCategory = $stateParams.category;
		$scope.obj = {};
		$scope.feeds = feedsService.feedsDictionary;
		$scope.adviced = feedsService.advicedDictionary;
		$scope.categories = feedsService.allCategories;
		$scope.addingNewCategory = false;
		$scope.newCategory = {};
		$scope.profileData = profileService;
		$scope.profile = $scope.profileData.profile;

		$scope.toPopular = false;
		$scope.advicedToDelete = null;

		if ($state.current.name === 'dashboard.addFeed' || $state.current.name === 'dashboard.adviced') {
			dashboardService.isReadingArticle = true;
		}

		$scope.getFirstArticle = function (id) {
			for (var i = 0, array = articlesService.articles; i < array.length; i++) {
				if (array[i].feed == id) {
					return array[i];
				}
			}
		}

		$scope.IgnoreDoubleClick = function () {
			return false;
		}

		$scope.checkIfNew = function () {
			if ($scope.obj.category.toUpperCase() == 'custom'.toUpperCase()) {
				$scope.addingNewCategory = true;
			}
			else {
				$scope.addingNewCategory = false;
				$scope.newCategory = {};
			}
		}

		$scope.addFeed = function () {
			$scope.error = '';
			if (!$scope.obj.link) {
				$scope.error = 'Enter Rss feed link';
				dashboardService.hideLoading();
				return;
			}
			if ($scope.newCategory.category) {
				$scope.obj.category = $scope.newCategory.category;
			}
			if (!$scope.obj.category) {
				if (!$scope.advicedCategory) {
					$scope.error = 'Choose category';
					dashboardService.hideLoading();
					return;
				}
			}
			if (!$scope.newCategory.category && $scope.obj.category.toUpperCase() == 'custom'.toUpperCase()) {
				$scope.error = 'Enter new category name';
				dashboardService.hideLoading();
				return;
			}
			if (!$scope.obj.category) {
				$scope.obj.category = $scope.advicedCategory;
			}
			if (!$scope.toPopular) {
				dashboardService.displayLoading();
				feedsService.addFeed($scope.obj)
				.then(function (res) {
					$scope.addingNewCategory = false;
					toasterService.success('Feed successfully added');
					var feedId = res.data._id;
					feedsService.getAllFeeds().then(function (res) {
						$state.go('dashboard.' + dashboardService.getViewMode(), { type: 'feed', value1: feedId });
					});

				}, function (err) {
					if (typeof err === 'string') {
						$scope.error = err;
					}
					if (err.data) {
						changeCatObj = {
							id: err.data.id,
							category: err.data.category,
							newCategory: $scope.obj.category
						};
						toasterService.confirm({
							message: 'Switch category?',
							confirm: 'switchCategory'
						}, $scope);
					}
					if (!err.data) {
						if (err.message) {
							$scope.error = err.message;
						}
					}
					else {
						$scope.error = err.data.message;
					}
				}).finally(function () {
					dashboardService.hideLoading();
				});
			}
			else {
				toasterService.confirm({
					message: 'If you add this feed to popular, everyone will see it. Confirm?',
					confirm: 'addAdvicedFeed',
					delay: 6000
				}, $scope);
			}
		}

		$scope.addAdvicedFeed = function () {
			dashboardService.displayLoading();
			feedsService.addAdvicedFeed($scope.obj)
				.then(function (res) {
					$scope.addingNewCategory = false;
					toasterService.success('Adviced feed successfully added');
					$state.reload("dashboard.addFeed");
				}, function (err) {
					if (typeof err === 'string') {
						$scope.error = err;
					}
					if (!err.data) {
						if (err.message) {
							$scope.error = err.message;
						}
					}
					else {
						$scope.error = err.data.message;
					}
				}).finally(function () {
					dashboardService.hideLoading();
				});
		}

		$scope.setAdvicedCover = function (file, errFiles, category) {
			$scope.f = file;
			if (errFiles) {
				$scope.errFile = errFiles[0];
			}
			else {
				$scope.errFile = null;
			}
			console.log("uploading");

			if (file) {
				Upload.upload({
					url: "/uploadAdvicedCover", //webAPI exposed to upload the file
					data: {
						file: file,
						user: authService.userID(),
						category: category
					}, //pass file as data, should be user ng-model
					headers: {
						Authorization: 'Bearer ' + authService.getToken()
					}
				}).then(function (res) { //upload function returns a promise
					if (res.data.error_code === 0) { //validate success
						$state.reload();
					} else {
						$window.alert('an error occured');
					}
				}, function (err) { //catch error
					if (err.status > 0)
						$scope.errorMsg = err.status + ': ' + err.data;
				});
			}
		}

		$scope.switchCategory = function () {
			feedsService.switchCategory(changeCatObj);
		}

		$scope.toAdvicedCategory = function (cat) {
			$state.go('dashboard.adviced', { category: cat });
		}

		$scope.addFeedByAdvice = function (feed) {
			$scope.addingNewCategory = false;
			$scope.obj.link = feed.rsslink;
			$scope.error = null;
			$scope.obj.category = '';
			$scope.modalShown = !$scope.modalShown;
		}

		$scope.onAdvicedDelete = function (feed) {
			$scope.advicedToDelete = feed;
			toasterService.confirm({
				message: "Remove this feed from popular?",
				confirm: "confirmAdvicedDelete"
			}, $scope);
		}

		$scope.confirmAdvicedDelete = function () {
			dashboardService.displayLoading();
			feedsService.removeAdvicedFeed($scope.advicedToDelete._id)
				.then(function (res) {
					toasterService.info("Feed has been deleted");
					for (var i = 0, array = feedsService.advicedDictionary ; i < array.length; i++) {
						if (array[i].category === $stateParams.category) {
							if (array[i].feeds.length <= 1) {
								$state.go('dashboard.addFeed', { reload: true });
							}
							else {
								$state.reload('dashboard.adviced');
							}
						}
					}
					return res;
				}, function (err) {
					console.log(err);
					return err;
				}).finally(function () {
					dashboardService.hideLoading();
				});
		}

		$scope.setCoverImage = function (item) {
		    if (item.coverImage) {
		        return { 'background-image': 'url(' + item.coverImage + ')', 'background-size': 'cover', 'background-position': 'center center' }
		    }
		    return '';
		}

		$scope.readArticle = function (article) {
			$state.go('dashboard.article', { feed: article.feed, link: article.link });
		}

		$scope.addPopular = function () {
			$scope.modalShown = !$scope.modalShown;
		}
	}]);
})();