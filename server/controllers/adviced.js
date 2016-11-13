var multer = require('multer'),
	fs = require('fs'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Feed = mongoose.model('Feed'),
	Article = mongoose.model('Article'),
	Advice = mongoose.model('Advice'),
	msg = require('../config/msg'),
	storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, './dist/assets/images/');
		},
		filename: function (req, file, cb) {
			var datetimestamp = Date.now();
			cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
		}
	});

var upload = multer({
	storage: storage
}).single('file');

module.exports.getAdvicedFeeds = function (req, res, next) {
	Advice.findOne({}, function (err, advice) {
		if (err) {
			return next(err);
		}
		if (advice) {
			advice.populate("feedsDictionary.feeds", function (err, user) {
				res.json(advice.feedsDictionary);
			});
		}
		else {
			res.status(404).send({
				message: msg.ERRORS.not_found
			});
			return;
		}
	});
}

module.exports.addAdvicedFeed = function (req, res, next) {
	if (!req.user.admin) {
		res.status(400).send({
			message: msg.ERRORS.no_rights
		});
		return;
	}
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
	Advice.findOne({}, function (err, adviced) {
		if (err) {
			return next(err);
		}
		if (adviced) {
			adviced.populate("feedsDictionary.feeds", function (err, adviced) {
				Feed.findOne({ rsslink: req.body.rsslink }, function (err, feed) {
					if (err) {
						return next(err);
					}
					var currentFeed = feed;
					var foundCategory = null;

					for (var i = 0; i < adviced.feedsDictionary.length; i++) {
						if (adviced.feedsDictionary[i].category === req.body.category) {
							foundCategory = adviced.feedsDictionary[i];
						}
						for (var j = 0; j < adviced.feedsDictionary[i].feeds.length; j++) {
							if (adviced.feedsDictionary[i].feeds[j].rsslink === req.body.rsslink) {
								return res.status(400).json({
									message: msg.ERRORS.feed_already_added_to_popular,
									id: adviced.feedsDictionary[i].feeds[j]._id,
									category: adviced.feedsDictionary[i].category
								});
							}
						}
					}

					if (currentFeed) {
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
								adviced.feedsDictionary.push(newFeedElement);
							}
							else {
								foundCategory.feeds.push(currentFeed);
							}
							adviced.save(function (err, adviced) {
								if (err) {
									return next(err);
								}
								res.json(currentFeed);
							});
						});
					}
					else {
						var feed = new Feed(req.body);
						feed.totalSubscriptions = 0;
						feed.currentSubscriptions = 0;
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
								adviced.feedsDictionary.push(newFeedElement);
							}
							else {
								foundCategory.feeds.push(feed);
							}
							adviced.save(function (err, adviced) {
								if (err) {
									return next(err);
								}
								res.json(feed);
							});
						});
					}
				});
			});
		}
		else {
			res.status(404).send({
				message: msg.ERRORS.not_found
			});
			return;
		}
	});
};

module.exports.removeAdvicedFeed = function (req, res, next) {
	if (!req.user.admin) {
		res.status(400).send({
			message: msg.ERRORS.no_rights
		});
		return;
	}
	Advice.findOne({}, function (err, adviced) {
		if (err) {
			return next(err);
		}
		if (adviced) {
			adviced.populate("feedsDictionary.feeds", function (err, adviced) {
				var foundCategoryIndex,
				foundCategory = null,
				foundFeedIndex,
				foundFeed = null;

				for (var i = 0, array = adviced.feedsDictionary; i < array.length; i++) {
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

				if (foundCategory.feeds.length === 1) {
					adviced.feedsDictionary.splice(foundCategoryIndex, 1);
				}
				else {
					foundCategory.feeds.splice(foundFeedIndex, 1);
				}

				adviced.save(function (err, adviced) {
					if (err) return next(err);
					res.statusCode = 200;
					return res.send();
				});
			});
		}
		else {
			res.status(404).send({
				message: msg.ERRORS.not_found
			});
			return;
		}
	});
}

module.exports.uploadAdvicedCover = function (req, res, next) {
	if (!req.user.admin) {
		res.status(400).send({
			message: msg.ERRORS.no_rights
		});
		return;
	}
	upload(req, res, function (err) {
		if (req.file) {
			var fileName = req.file.filename;
			Advice.findOne({}, function (err, adviced) {
				if (err) {
					return next(err);
				}
				var foundCategory;
				for (var i = 0, array = adviced.feedsDictionary; i < array.length; i++) {
					if (array[i].category === req.body.category) {
						foundCategory = array[i];
						break;
					}
				}
				if (!foundCategory) {
					res.status(404).send({
						message: msg.ERRORS.not_found
					});
					return;
				}
				try {
					fs.unlinkSync('dist/' + foundCategory.coverImage);
				} catch (e) {
					console.log(err);
				}
				foundCategory.coverImage = "assets/images/" + fileName;
				adviced.save(function (err, adviced) {
					res.json({ error_code: 0, err_desc: null });
				});
				if (err) {
					res.json({ error_code: 1, err_desc: err });
					return;
				}
			});			
		} else return res.status(500).json({
			message: msg.ERRORS.file_not_found
		});
	});
}