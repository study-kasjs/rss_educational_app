var jwt = require('jwt-simple'),
	mongoose = require('mongoose'),
	request = require('request'),
	moment = require('moment'),
	User = mongoose.model('User'),
	qs = require('querystring'),
	config = require('../../config/config'),
	msg = require('../../config/msg');

module.exports.twitterAuth = function(req, res) {
	var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
	var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
	var profileUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json';

	if (!req.body.oauth_token || !req.body.oauth_verifier) {
		var requestTokenOauth = {
			consumer_key: config.TWITTER_KEY,
			client_id: req.body.clientId,
			consumer_secret: config.TWITTER_SECRET,
			callback: req.body.redirectUri
		};
		request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
			var oauthToken = qs.parse(body);
			res.send(oauthToken);
		});
	} else {
		var accessTokenOauth = {
			consumer_key: config.TWITTER_KEY,
			consumer_secret: config.TWITTER_SECRET,
			token: req.body.oauth_token,
			verifier: req.body.oauth_verifier
		};
		request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, accessToken) {
			accessToken = qs.parse(accessToken);
			var profileOauth = {
				consumer_key: config.TWITTER_KEY,
				consumer_secret: config.TWITTER_SECRET,
				token: accessToken.oauth_token,
				token_secret: accessToken.oauth_token_secret,
			};

		request.get({
			url: profileUrl,
			qs: { include_email: true },
			oauth: profileOauth,
			json: true
		}, function(err, response, profile) {

			if (req.header('Authorization')) {
				User.findOne({ twitter: profile.id }, function(err, existingUser) {
					if (existingUser) {
						return res.status(409).send({ 
							message: msg.ERRORS.twitter_account_belongs 
						});
					}

					var token = req.header('Authorization').split(' ')[1];
					var payload = jwt.decode(token, config.TOKEN_SECRET);

					User.findById(payload.sub, function(err, user) {
						if (!user) {
							return res.status(400).send({ 
								message: msg.ERRORS.user_not_found 
							});
						}
						user.twitter = profile.id;
						user.displayName = user.displayName || profile.name;
						user.picture = user.picture || profile.profile_image_url_https.replace('_normal', '');
						user.save(function () {
							var token = config.createJWT(user);
							res.send({
								token: token,
								profile: profile  
							});
						});
					});
				});
			} else {
				User.findOne({ twitter: profile.id }, function(err, existingUser) {
					if (existingUser) {
						return res.send({ 
							token: config.createJWT(existingUser) 
						});
					}

					var user = new User();
					user.email = profile.id;
					user.twitter = profile.id;
					user.displayName = profile.name;
					user.picture = profile.profile_image_url_https.replace('_normal', '');
					user.save(function () {
						var token = config.createJWT(user);
						res.send({ 
							token: token,
							profile : profile
						});
					});
				});
			}
		});
		});
	}
};