var mongoose = require('mongoose'),
	express = require('express'),
	router = express.Router(),
	jwt = require('jwt-simple'),
	Article = mongoose.model('Article'),
	Feed = mongoose.model('Feed'),
	User = mongoose.model('User'),
	config = require('../config/config'),
	googleAuth = require('../controllers/authentication/googleAuth'),
	facebookAuth = require('../controllers/authentication/facebookAuth'),
	twitterAuth = require('../controllers/authentication/twitterAuth'),
	linkedInAuth = require('../controllers/authentication/linkedinAuth'),
	unlink = require('../controllers/authentication/unlink'),
	userInfo = require('../controllers/authentication/userInfo'),
	authCtrl = require('../controllers/authentication/authentication'),
	articlesCtrl = require('../controllers/articles'),
	feedsCtrl = require('../controllers/feeds'),
	profCtrl = require('../controllers/profile'),
	advicedCtrl = require('../controllers/adviced');

var auth = function (req, res, next) {
	var token = req.body.token || req.params.token || req.headers['authorization'];
	if (token) {
		token = token.replace('Bearer ', '');
		var decoded = jwt.decode(token, config.TOKEN_SECRET);
		if (decoded) {
			if (new Date(decoded.exp) < new Date()) {
				return res.status(403).send({
					success: false,
					message: 'Session token expired'
				});
			}
			else {
				User.findById(decoded.sub, function (err, user) {
					if (err) {
						return next(err);
					}
					if (!user) {
						return next(new Error('Can\'t find user'));
					}
					req.user = user;
					return next();
				});
			}
		}
	} else {
		return res.status(403).send({
			success: false,
			message: 'No auth token provided.'
		});
	}
}

router.post('/register', authCtrl.register);
router.post('/forgot', authCtrl.forgotPass);
router.get('/reset/:token', authCtrl.reset);
router.post('/reset/:token', authCtrl.resetPost);
router.post('/login', authCtrl.login);
router.post('/changePassword', authCtrl.changePassword);
//Auth
router.post('/auth/google', googleAuth.googleAuth);
router.post('/auth/facebook', facebookAuth.facebookAuth);
router.post('/auth/twitter', twitterAuth.twitterAuth);
router.post('/auth/linkedin', linkedInAuth.linkedInAuth);
router.post('/auth/unlink', unlink.unlink);
router.get('/api/me', userInfo.getUserInfo);
router.put('/api/me', userInfo.putUserInfo);

//Secured routes
router.post('/changeColorTheme', auth, profCtrl.changeColorTheme);

router.get('/feeds', auth, feedsCtrl.allFeed);
router.get('/getSingleFeed/:id', auth, feedsCtrl.getSingleFeed);
router.get('/favourites', auth, articlesCtrl.allFavourites);
router.get('/advicedArticles', auth, articlesCtrl.getAdvicedArticles);
router.get('/advicedFeeds', auth, advicedCtrl.getAdvicedFeeds);

router.post('/addFeed', auth, feedsCtrl.add);
router.post('/setCategoryOrder', auth, feedsCtrl.setCategoryOrder);
router.post('/setFeedsOrder', auth, feedsCtrl.setFeedsOrder);
router.post('/setFavsCategoryOrder', auth, feedsCtrl.setFavsCategoryOrder);
router.post('/addFavArticle', auth, articlesCtrl.addFavArticle);
router.post('/getFavArticle', auth, articlesCtrl.getFavArticle);
router.post('/changeFeedCategory/:category', auth, feedsCtrl.changeFeedCategory);
router.post('/upload', auth, profCtrl.upload);

// Admin routes
router.post('/uploadAdvicedCover', auth, advicedCtrl.uploadAdvicedCover);
router.post('/addAdvicedFeed', auth, advicedCtrl.addAdvicedFeed);
router.delete('/deleteAdvicedFeed/:id', auth, advicedCtrl.removeAdvicedFeed);


router.delete('/deleteFeed/:id', auth, feedsCtrl.remove);
router.delete('/deleteFavFeed/:id', auth, articlesCtrl.removeFavArticle);

module.exports = router;
