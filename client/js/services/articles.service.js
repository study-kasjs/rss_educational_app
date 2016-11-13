(function () {
	'use strict';
	String.prototype.replaceAll = function (target, replacement) {
		return this.split(target).join(replacement);
	};
	angular.module('rssreader').factory('articlesService', ['$http', '$rootScope', '$state', '$q', 'authService', '$timeout', 'dashboardService', 'feedsService', function ($http, $rootScope, $state, $q, authService, $timeout, dashboardService, feedsService) {
		var ARTICLES_NUM = 50,
			loadDelay = 350,
			temp_articles = [],
			defer = $q.defer(),
			promises = [],
			obj = {
			    articles: [],
			    advicedArticles: [],
			    articleForRead: null,
			    isFavourites: false,
			    displayedIncrement: 20,
			    totalDisplayed: 20,

			    setReadArticle: function (feed, link, type) {
			        var someObj = obj.articleForRead;
			        if(!type){
			            return feedsService.getSingleFeed(feed).then(function (res) {
			                obj.resetArticles();
			                var feedObj = res.data;
			                return fetchArticles(feedObj).then(function (res) {
			                    for (var i = 0; i < res.length; i++) {
			                        if (res[i].link === link) {
			                            obj.articleForRead = res[i];
			                            return;
			                        }
			                    }
			                    obj.articleForRead = null;
			                });
			            });
			        }
			        else if (type === 'adviced' || type === 'favourite') {
				        return getArticleDataByLink(link).then(function (res) {
				            obj.resetArticles();
				            obj.articleForRead = res.data;
				        });
				    }
				},
				getAllArticles: function () {
					obj.resetArticles();
					dashboardService.setTitle('All');
					angular.forEach(feedsService.feedsDictionary, function (value, key) {
						angular.forEach(value.feeds, function (value, key) {
							promises.push(fetchArticles(value));
						});
					});
					return $q.all(promises).then(function (res) {
					    obj.articles = temp_articles;
					    return res;
					});
				},
				getArticlesByFeed: function (feed, num) {
					obj.resetArticles();
					return fetchArticles(feed, num).then(function (res) {
						dashboardService.setFeed(feed);
						dashboardService.setTitle(feed.title);
						dashboardService.readSingleFeed.state = true;
						dashboardService.setSortParam('date', 1);
						obj.articles = temp_articles;
						return res;
					}, function (err) {
					    console.log(err);
					    return err;
					});
				},
				getArticlesByCat: function (cat) {
					var found = false;
					obj.resetArticles();
					angular.forEach(feedsService.feedsDictionary, function (value, key) {
						if (value.category === cat) {
							found = true;
							angular.forEach(value.feeds, function (value, key) {
								promises.push(fetchArticles(value));
							});
						}
					});
					if (!found) {
						return $q.reject().catch(function (err) {
						    $state.go('404');
						    return err;
						});
					}
					return $q.all(promises).then(function (res) {
						dashboardService.setTitle(cat);
						obj.articles = temp_articles;
						return res;
					}, function (err) {
					    console.log(err);
					    return err;
					});
				},
				getAdvicedArticlesByCat: function (cat) {
				    obj.resetArticles();
				    for (var i = 0, array = feedsService.advicedDictionary; i < array.length; i++) {
				        if (array[i].category === cat) {
				            for (var j = 0; j < array[i].feeds.length; j++) {
				                promises.push(fetchArticles(array[i].feeds[j], 1));
				            }
				            break;
				        }
				    }
				    return $q.all(promises).then(function (res) {
					    obj.articles = temp_articles;
					    return res;
					});
				},
				getFavourites: function () {
					obj.resetArticles();
					obj.isFavourites = true;
					dashboardService.setTitle('Favourites');
					var tempCategory = '';
					angular.forEach(feedsService.favouritesDictionary, function (value, key) {
					    tempCategory = value.category;
					    angular.forEach(value.articles, function (value, key) {
					        value.category = tempCategory;
							obj.articles.push(value);
						});
					});
				},
				getFavArticlesByCat: function (cat) {
					obj.resetArticles();
					obj.isFavourites = true;
					dashboardService.setTitle('Favourites: ' + cat);
					var tempCategory = '';
					angular.forEach(feedsService.favouritesDictionary, function (value, key) {
					    if (value.category === cat){
					        tempCategory = cat;
						    angular.forEach(value.articles, function (value, key) {
						        value.category = tempCategory;
								obj.articles.push(value);
							});
						}
					});
				},
				getFavArticle: function (article) {
					obj.resetArticles();
					dashboardService.hideSortList.state = true;
					obj.isFavourites = true;
					dashboardService.setTitle('Favourites');
					obj.articles.push(article);
				},
				addFavourite: function (article) {
					return $http.post('/addFavArticle', article).then(function (res) {
					    angular.copy(res.data, feedsService.favouritesDictionary);
					    return res;
					});
				},
				removeFavourite: function (article) {
					
					return $http.delete('/deleteFavFeed/' + article._id).then(function (res) {
					    angular.copy(res.data, feedsService.favouritesDictionary);
					    return res;
					});
				},
				getAdvicedArticles: function () {
					obj.advicedArticles.length = 0;
					return $http.get('/advicedArticles').then(function (res) {
					    angular.copy(res.data, obj.advicedArticles);
					    return res;
					}, function (err) {
					    console.log(err);
					    return err;
					});
				},
				getAdvicedFeedsArticles: function () {
					obj.advicedArticles.length = 0;
					return $http.get('/advicedArticles').then(function (res) {
						angular.copy(res.data, obj.advicedArticles);
					}, function (err) {
						console.log(err);
					});
				},
				resetArticles: function () {
					dashboardService.hideSortList.state = false;
					dashboardService.readSingleFeed.state = false;
					
					dashboardService.resetFeed();
					this.totalDisplayed = this.displayedIncrement;
					temp_articles.length = 0;
					obj.articles.length = 0;
					obj.isFavourites = false;
					promises.length = 0;
				},
				// Additional method for unit testing
				getArticlesFetcher: function () {
					return fetchArticles;
				}
			},
			getImage = function (item, format) {
				var source = '';
				if (format === 'RSS') {
				    if (!item.getElementsByTagName('enclosure').length) {
				        try {
				            var content = document.createElement('div');
				            content.innerHTML = item.getElementsByTagName('description')[0].textContent;
				            if ($(content).find('img')[0].width > 10 && $(content).find('img')[0].height > 10) {
				                source = $(content).find('img')[0].src;
				            }
				        } catch (err) {
				            source = '';
				        }
						if (source === '' || source === undefined) {
						    try {
						        source = $(item).find('media\\:content, content')[0].getAttribute('url');
						    } catch (err) {
						        source = '';
						    }
						}
					} else {
						source = item.getElementsByTagName('enclosure')[0].getAttribute('url');
					}
				} else if (format === 'ATOM') {
					if (!item.getElementsByTagName('enclosure').length) {
						try {
						    var content = document.createElement('div');
						    content.innerHTML = item.getElementsByTagName('content')[0].textContent;
							source = $(content).find('img')[0].src;
						} catch (err) {
							source = '';
						}
					}
				}
				return source;
			},
			getContent = function (item, format) {
				var content = '';
				if (format === 'RSS') {
					try {
						content = document.createElement('div');
						content.innerHTML = item.getElementsByTagName('description')[0].textContent;
						content = $(content).text();
					} catch (err) {
					}
				} else if (format === 'ATOM') {
					content = $(item.getElementsByTagName('content')[0].childNodes[0].data).text();

				}
				if (typeof content !== 'string') {
					return '';
				}
				else return content.toString();
			},
			fetchArticles = function (feed, num, from) {
				var articlesNum = ARTICLES_NUM;
				if (num) {
					articlesNum = num;
				}
				if (!from || from > num - 1) {
					from = 0;
				}
				return $http.jsonp('https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=' + articlesNum + '&q=' + encodeURIComponent(feed.rsslink) + '&method=JSONP&callback=JSON_CALLBACK&output=xml&dummy=' + Date.now())
				.then(function (response) {
				    
					var parser = new DOMParser(),
						xmlDoc = parser.parseFromString(response.data.responseData.xmlString, 'text/xml'),
						items = [];
					if (feed.format === 'RSS') {
					    items = xmlDoc.getElementsByTagName('item');
					    if (from > items.length) {
					        from = 0;
					    }
					    for (var i = from; i < items.length; i++) {
					        var articleObj = {
					            title: items[i].getElementsByTagName('title')[0].innerHTML,
					            link: items[i].getElementsByTagName('link')[0].textContent,
					            img: getImage(items[i], feed.format),
					            content: getContent(items[i], feed.format),
					            feed: feed._id
					        };
					        if (articleObj.title) {
					            articleObj.title.replaceAll('apos;', '\'')
												.replaceAll('&apos;', '\'')
												.replaceAll('&amp;', '')
												.replaceAll('&#8217;', 'bb');
					        }
					        if (items[i].getElementsByTagName('pubDate')[0]) {
					            articleObj.date = Date.parse(items[i].getElementsByTagName('pubDate')[0].textContent);
					        }
					        else if (!items[i].getElementsByTagName('pubDate')[0] && !articleObj.img && !articleObj.content) {
					            continue;
					        }
					        articleObj.content = articleObj.content ? articleObj.content : articleObj.title;
					        temp_articles.push(articleObj);
					    }
					} else if (feed.format === 'ATOM') {
					    items = xmlDoc.getElementsByTagName('entry');
					    if (from > items.length) {
					        from = 0;
					    }
					    for (var i = from; i < items.length; i++) {
					        var articleObj = {
					            title: items[i].getElementsByTagName('title')[0].textContent,
					            link: angular.element(items[i].getElementsByTagName('link'))[0].attributes['href'].value,
					            img: getImage(items[i], feed.format),
					            content: getContent(items[i], feed.format),
					            date: Date.parse(items[i].getElementsByTagName('published')[0].textContent),
					            feed: feed._id
					        };
					        if (articleObj.title) {
					            articleObj.title.replaceAll('apos;', '\'')
												.replaceAll('&apos;', '\'')
												.replaceAll('&amp;', '')
												.replaceAll('&#8217;', 'bb');
					        }
					        articleObj.content = articleObj.content ? articleObj.content : articleObj.title;
					        temp_articles.push(articleObj);
					    }
					}
					return temp_articles;
				});
			},
			getArticleDataByLink = function (link) {
				return $http.post('/getFavArticle', { link: link });
			}
		return obj;
	}]);
})();