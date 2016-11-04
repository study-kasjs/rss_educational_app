(function () {
	'use strict';
	angular.module('rssreader').controller('ArticlesController', ['$scope', '$state', '$rootScope', '$window', '$stateParams', 'toasterService', 'dateFilter', 'feedsService', 'articlesService', 'dashboardService', function ($scope, $state, $rootScope, $window, $stateParams, toasterService, dateFilter, feedsService, articlesService, dashboardService) {
		var queryTypes = ['all', 'category', 'feed', 'favourites'];
		$window.scrollTo(0, 0);
		analizeRouting();
		$scope.articleData = articlesService;
		$scope.obj = {};
		$scope.newCategory = {};
		$scope.categories = feedsService.allFavsCategories;
		$scope.error = null;
		$scope.modalShown = false;
		$scope.favForAdd = null;
		$scope.favForRemove = null;
		$scope.articleForShare = null;
		$scope.articleForRead = articlesService.articleForRead;
		$scope.addingNewFavCategory = false;

		$scope.firstListItem = {
			title: ''
		}

		$scope.checkIfFavourites = function (article) {
			if (!article) {
				return false;
			}
			for (var i = 0; i < feedsService.favouritesDictionary.length; i++) {
				for (var j = 0; j < feedsService.favouritesDictionary[i].articles.length; j++) {
					if (feedsService.favouritesDictionary[i].articles[j].link === article.link) {
						return true;
					}
				}
			}
			return false;
		}

		$scope.loadMore = function () {
			$scope.articleData.totalDisplayed += $scope.articleData.displayedIncrement;
		}

		$scope.isAllDisplayed = function () {
			return $scope.articleData.totalDisplayed >= $scope.articleData.articles.length;
		}

		$scope.getSortParam = function () {
			var sortParam = dashboardService.getSortParam();
			if (sortParam.type === 'feed') {
				return ['feed', 'date'];
			}
			return sortParam;
		}

		$scope.checkIfNew = function () {
			if ($scope.obj.category.toUpperCase() == 'custom'.toUpperCase()) {
				$scope.addingNewFavCategory = true;
			}
			else {
				$scope.addingNewFavCategory = false;
				$scope.newCategory = {};
			}
		}
		
		$scope.getTitle = function (article, index) {
			if (index == articlesService.articles.length - 1 || !article) {
				return '';
			}
			if (!$scope.articleData.isFavourites) {
			    for (var i = 0, array = feedsService.feedsDictionary; i < array.length; i++) {
			        for (var j = 0; j < array[i].feeds.length; j++) {
			            if (array[i].feeds[j]._id == article.feed) {
			                return array[i].feeds[j].title;
			            }
			        }
			    }
			}
			else {
			    return article.category;
			}
		}

		$scope.checkIfFirst = function () {
			if (dashboardService.getSortParam().type === 'feed') {
				return $scope.firstListItem.title;
			}
			return false;
		}

		$scope.setFirstTitle = function (article, flag) {
			if (!article || !flag) {
				return;
			}
			if (!$scope.articleData.isFavourites) {
			    for (var i = 0, array = feedsService.feedsDictionary; i < array.length; i++) {
			        for (var j = 0; j < array[i].feeds.length; j++) {
			            if (array[i].feeds[j]._id == article.feed) {
			                $scope.firstListItem.title = array[i].feeds[j].title;
			            }
			        }
			    }
			}
			else {
			    $scope.firstListItem.title = article.category;
			}
			return false;
		}

		$scope.toShowTitle = function (current, next, $index) {
			if (!next) {
				return false;
			}
			if (current.feed !== next.feed) {
				if (dashboardService.getSortParam().type === 'feed') {
					return true;
				}
			}
			return false;
		}

		$scope.addFavourite = function (article) {
			dashboardService.displayLoading();
			$scope.favForAdd = article;
			feedsService.getSingleFeed(article.feed).then(function (res) {
				$scope.favForAdd.category = res.data.title;
				return articlesService.addFavourite($scope.favForAdd).then(function (res) {
					$scope.resetAddFavValues();
					$scope.cancelAddFavourite();
					toasterService.success("Article marked as favourite");
					return res;
				}, function (err) {
					$scope.resetAddFavValues();
					console.log(err);
					if (!err.data)
						$scope.error = err.message;
					else $scope.error = err.data.message;
					return err;
				});
			}, function (err) {
				console.log(err);
				return err;
			}).finally(function () {
				dashboardService.hideLoading();
			});
		}
		
		$scope.removeFavourite = function (article, cat) {
			$scope.favForRemove = article;
			toasterService.confirm({
				message: "Remove this article?",
				confirm: "confirmRemoveFavourite"
			}, $scope);
		}

		$scope.confirmRemoveFavourite = function () {
			dashboardService.displayLoading();
			articlesService.removeFavourite($scope.favForRemove).then(function (res) {
				toasterService.info("Article removed from favourites");
				for (var i = 0, array = res.data; i < array.length; i++) {
					if (array[i].category === $scope.favForRemove.category && array[i].articles.length > 0) {
						if ($stateParams.value2) {
							articlesService.getFavArticlesByCat($stateParams.value2);
						}
						else {
							articlesService.getFavourites();
						}
						return;
					}
				}
				if (!res.data.length) {
					$state.go('dashboard.' + dashboardService.getViewMode(), { type: 'all', value1: '', value2: '' });
				}
				else {
					$state.go("dashboard." + dashboardService.getViewMode(), { type: "favourites", value1: '', value2: '' }, {reload: true});
				}
				return res;
			}, function (err) {
				console.log(err);
				return err;
			}).finally(function () {
				dashboardService.hideLoading();
			});
		}

		$scope.resetAddFavValues = function () {
			dashboardService.hideLoading();
			$scope.newCategory = {};
			$scope.obj = {};
			$scope.addingNewFavCategory = false;
		}

		$scope.cancelAddFavourite = function () {
			$scope.modalShown = false;
			$scope.favForAdd = {};
			$scope.newCategory = {};
		}

		$scope.share = function (article) {
			$scope.error = null;
			$scope.articleForShare = article;
		}

		$scope.cancelSharing = function () {
			$scope.modalShareShown = false;
			$scope.articleForShare = {};
		}

		$scope.getArticleDate = function (date) {
			if (!date) {
				return;
			};
			return dateFilter(new Date(date), "dd/MM/yy HH:mm");
		}

		$scope.readArticle = function (article, type) {
			articlesService.articleForRead = article;
			$state.go("dashboard.article", { feed: article.feed, link: article.link, type: type });
		}

		$rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
		    $rootScope.changeList = false;
		    if (from.name !== to.name) {
		        $rootScope.changeList = true;
		        for (var param in toParams) {
		            if (toParams[param] !== fromParams[param]) {
		                $rootScope.changeList = false;
		                break;
		            }
		        }
		    }		    
		});

		angular.element(document.body).bind('click', function (e) {
			var popups = document.querySelectorAll('.popover');
			if (popups) {
				for (var i = 0; i < popups.length; i++) {
					var popup = popups[i];
					var popupElement = angular.element(popup);
					if (popupElement[0].previousSibling != e.target) {
						popupElement.scope().$parent.isOpen = false;
						popupElement.scope().$parent.$apply();
					}
				}
			}
		});

		function analizeRouting() {
		    if ($rootScope.changeList) {
		        return;
		    }
		    dashboardService.displayLoading();
			var routeType = $stateParams.type;
			var exist = queryTypes.filter(function (elem, i, array) {
				return elem === routeType;
			});


			if (!routeType || !exist.length) {
				if ($stateParams.feed && $stateParams.link) {
					dashboardService.isReadingArticle = true;
					if (articlesService.articleForRead && $stateParams.link === articlesService.articleForRead.link) {
						dashboardService.hideLoading();
						return;
					}
					return articlesService.setReadArticle($stateParams.feed, $stateParams.link, $stateParams.type)
					.then(function (res) {
						if (articlesService.articleForRead === null) {
							$state.go("404");
							return res;
						}
						$scope.articleForRead = articlesService.articleForRead;
						return res;
					}, function (err) {		                
						console.log(err);
						return err;
					}).finally(function () {
						dashboardService.hideLoading();
					});
				}
				else {
					dashboardService.isReadingArticle = false;
					if (feedsService.feedsDictionary.length < 1) {
						$state.go("dashboard.addFeed");
					}
					else {
						$state.go('dashboard.' + dashboardService.getViewMode(), { type: 'all' });
					}
					dashboardService.hideLoading();
					return;
				}
			}
			else {
				dashboardService.isReadingArticle = false;
				switch (routeType) {
					case 'all': {
						if (feedsService.feedsDictionary.length < 1) {
							$state.go("dashboard.addFeed");
							dashboardService.hideLoading();
						}
						else {
							articlesService.getAllArticles().finally(function () {
								dashboardService.hideLoading();
							});
						}
					}
						break;
					case 'feed': {
						feedsService.getSingleFeed($stateParams.value1).then(function (res) {
							return articlesService.getArticlesByFeed(res.data);
						}, function (err) {
							console.log(err);
							return err;
						}).finally(function () {
							dashboardService.hideLoading();
						});
					}
						break;
					case 'category': {
						articlesService.getArticlesByCat($stateParams.value1).finally(function () {
							dashboardService.hideLoading();
						});
					}
						break;
					case 'favourites': {
						if ($stateParams.value1 === 'category' && $stateParams.value2) {
							articlesService.getFavArticlesByCat($stateParams.value2);
						}
						else if (!$stateParams.value1 && !$stateParams.value2) {
							articlesService.getFavourites();
						}
						dashboardService.hideLoading();
					}
						break;
				}
			}
		}
	}]);
})();