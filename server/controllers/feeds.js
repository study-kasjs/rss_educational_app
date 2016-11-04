var mongoose = require('mongoose'),
	fs = require("fs"),
	User = mongoose.model('User'),
	Feed = mongoose.model('Feed'),
	Article = mongoose.model('Article'),
	Advice = mongoose.model('Advice'),
	config = require('../config/config'),
	msg = require('../config/msg');

module.exports.allFeed = function (req, res, next) {
	req.user.populate("feedsDictionary.feeds", function (err, user) {
		res.json(user.feedsDictionary);
	});
}

module.exports.getSingleFeed = function (req, res, next) {
	if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
		return res.status(404).json({
			message: msg.ERRORS.not_found
		});
	}
	Feed.findById(req.params.id, function (err, feed) {
		if (err) {
			return next(err);
		}
		if (!feed) {
			return res.status(404).json({
				message: msg.ERRORS.not_found
			});
		}
		else {
			res.json(feed);
		}
	});
}

module.exports.add = function (req, res, next) {
	if (req.body.rsslink === undefined) {
		return res.status(400).json({
			message: msg.ERRORS.enter_feed_url
		});
	}
	if (req.body.category === undefined) {
		return res.status(400).json({
			message: msg.ERRORS.choose_cat
		});
	}

	Feed.findOne({ rsslink: req.body.rsslink }, function (err, feed) {
		if (err) {
			return next(err);
		}
		var currentFeed = feed;
		req.user.populate("feedsDictionary.feeds", function (err, user) {
			var foundCategory = null;
			for (var i = 0; i < user.feedsDictionary.length; i++) {
				if (user.feedsDictionary[i].category === req.body.category) {
					foundCategory = user.feedsDictionary[i];
				}
				for (var j = 0; j < user.feedsDictionary[i].feeds.length; j++) {
					if (user.feedsDictionary[i].feeds[j].rsslink === req.body.rsslink) {
						return res.status(400).json({
							message: msg.ERRORS.feed_already_added,
							id: user.feedsDictionary[i].feeds[j]._id,
							category: user.feedsDictionary[i].category
						});
					}
				}
			}

			if (currentFeed) {
				currentFeed.totalSubscriptions++;
				currentFeed.currentSubscriptions++;
				currentFeed.save(function (err, currentFeed) {
					if (err) {
						return next(err);
					}
					if (!foundCategory) {
						var newFeedElement = {
							category: req.body.category,
							feeds: []
						}
						newFeedElement.feeds.push(currentFeed);
						req.user.feedsDictionary.push(newFeedElement);
					}
					else {
						foundCategory.feeds.push(currentFeed);
					}
					req.user.save(function (err, user) {
						if (err) {
							return next(err);
						}
						res.json(currentFeed);
					});
				});		        
			}
			if (!currentFeed) {
				var feed = new Feed(req.body);
				feed.totalSubscriptions = 1;
				feed.currentSubscriptions = 1;
				feed.save(function (err, feed) {
					if (err) {
						return next(err);
					}
					if (!foundCategory) {		                   
							var newFeedElement = {
								category: req.body.category,
								feeds: []
							}
							newFeedElement.feeds.push(feed);
							req.user.feedsDictionary.push(newFeedElement);
					}
					else {
						foundCategory.feeds.push(feed);
					}
					req.user.save(function (err, user) {
						if (err) {
							return next(err);
						}
						res.json(feed);
					});
				});
			}
		});
	});
};

module.exports.remove = function (req, res, next) {
	req.user.populate("feedsDictionary.feeds", function (err, user) {
		var foundCategoryIndex,
			foundCategory = null,
			foundFeedIndex,
			foundFeed = null;

		for (var i = 0, array = req.user.feedsDictionary; i < array.length; i++) {
			for (var j = 0, feeds = array[i].feeds; j < feeds.length; j++) {
				if (feeds[j]._id == req.params.id) {
					foundFeed = feeds[j];
					foundFeedIndex = j;
					foundCategory = array[i];
					foundCategoryIndex = i;
				}
			}
		}

		if (!foundCategory) {
			return res.send({
				message: msg.ERRORS.cant_delete_feed_no_such_cat
			});
		}

		if (!foundFeed) {
			return res.send({
				message: msg.ERRORS.cant_delete_feed_no_such_feed
			});
		}

		Feed.findById(req.params.id, function (err, feed) {
			if (err) {
				return next(err);
			}
			if (!feed) {
				return next(new Error(msg.ERRORS.feed_not_found));
			}
			if (feed.currentSubscriptions > 0) {
				feed.currentSubscriptions--;
			}
			feed.save(function (err) {
				if (err) return next(err);
			});
		});

		if (foundCategory.feeds.length === 1) {
			req.user.feedsDictionary.splice(foundCategoryIndex, 1);
		}
		else {
			foundCategory.feeds.splice(foundFeedIndex, 1);
		}

		req.user.save(function (err, user) {
			if (err) return next(err);
			res.statusCode = 200;
			return res.send();
		});
	});
}

module.exports.setCategoryOrder = function (req, res, next) {
	var newFeedsDictionary = [],
		lookup = {};
	for (var i = 0, array = req.user.feedsDictionary; i < array.length; i++) {
		lookup[array[i].category] = array[i];
	}
	
	for (var i = 0; i < req.body.newCategories.length; i++) {
		newFeedsDictionary.push(lookup[req.body.newCategories[i]]);
	}
	req.user.feedsDictionary = newFeedsDictionary;
	req.user.save(function (err) {
		if (err) return next(err);
		res.statusCode = 200;
		return res.send();
	});
}

module.exports.setFeedsOrder = function (req, res, next) {
	req.user.feedsDictionary = req.body;
	req.user.save(function (err) {
		if (err) return next(err);
		res.statusCode = 200;
		return res.send();
	});
}

module.exports.setFavsCategoryOrder = function (req, res, next) {
	var newFavsDictionary = [],
		lookup = {};
	for (var i = 0, array = req.user.favouritesDictionary; i < array.length; i++) {
		lookup[array[i].category] = array[i];
	}

	for (var i = 0; i < req.body.newCategories.length; i++) {
		newFavsDictionary.push(lookup[req.body.newCategories[i]]);
	}
	req.user.favouritesDictionary = newFavsDictionary;
	req.user.save(function (err) {
		if (err) return next(err);
		res.statusCode = 200;
		return res.send();
	});
}

module.exports.changeFeedCategory = function (req, res, next) {
	if (!req.body.id || !req.body.category || !req.body.newCategory) {
		res.status(404).send({
			message: msg.ERRORS.not_found
		});
	}
	req.user.populate("feedsDictionary.feeds", function (err, user) {
		var lookup = {};
		for (var i = 0, array = req.user.favouritesDictionary; i < array.length; i++) {
			lookup[array[i].category] = array[i];
		}

		for (var i = 0, array = req.user.feedsDictionary; i < array.length; i++) {
			if (array[i].category == req.body.category) {
				for (var j = 0, feeds = array[i].feeds; j < feeds.length; j++) {
					if (feeds[j]._id == req.body.id) {
						array[i].feeds.splice(j, 1);
						if (!array[i].feeds.length) {
							array.splice(i, 1);
						}
						var pushedToExistin = false;
						for (var i = 0, array = req.user.feedsDictionary; i < array.length; i++) {
							if (array[i].category == req.body.newCategory) {
								array[i].feeds.push(req.body.id);
								pushedToExistin = true;
							}
						}
						if (!pushedToExistin) {
							var obj = {
								category: req.body.newCategory,
								feeds: []
							}

							obj.feeds.push(req.body.id);
							req.user.feedsDictionary.push(obj);
						}
						
						req.user.save(function (err) {
							if (err) return next(err);
							res.statusCode = 200;
							return res.send();
						});
					}
				}
			}
		}
	});
}

//var JsonFeeds = require('../AdvicedFeeds.json');
//addAdvicedFromJson = function (category, feed) {
//    var passedFeed = feed,
//		passedCategory = category;
//    Advice.find({}, function (err, advice) {
//        if (!advice.length) {
//            var advice = new Advice({
//                articlesDictionary: [],
//                feedsDictionary: []
//            });
//            for (var i = 0; i < JsonFeeds.feedsDictionary.length; i++) {
//                advice.feedsDictionary.push({
//                    category: JsonFeeds.feedsDictionary[i].category
//                });
//                for (var j = 0; j < JsonFeeds.feedsDictionary[i].feeds.length; j++) {
//                    var feed = new Feed(JsonFeeds.feedsDictionary[i].feeds[j]);
//                    feed.totalSubscriptions = 0;
//                    feed.currentSubscriptions = 0;
//                    advice.feedsDictionary[i].feeds.push(feed);
//                    feed.save(function (err, feed) {
//                        if (err) {
//                            console.log(err);
//                            return;
//                        }
//                    });
//                }
//            }
//            advice.save(function (err, advice) {
//                if (err) {
//                    console.log(err);
//                    return;
//                }
//            });
//        }
//    });
//};

//addAdvicedFromJson();