var jwt = require('jwt-simple'),
	mongoose = require('mongoose'),
	request = require('request'),
	moment = require('moment'),
	User = mongoose.model('User'),
	config = require('../../config/config'),
	msg = require('../../config/msg');

module.exports.linkedInAuth = function(req, res) {
	var accessTokenUrl = 'https://www.linkedin.com/uas/oauth2/accessToken';
	var peopleApiUrl = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url)';
	var params = {
		code: req.body.code,
		client_id: req.body.clientId,
		client_secret: config.LINKEDIN_SECRET,
		redirect_uri: req.body.redirectUri,
		grant_type: 'authorization_code'
	};


	request.post(accessTokenUrl, { form: params, json: true }, function(err, response, body) {
		if (response.statusCode !== 200) {
			return res.status(response.statusCode).send({ message: body.error_description });
		}
		var params = {
			oauth2_access_token: body.access_token,
			format: 'json'
		};
		request.get({ url: peopleApiUrl, qs: params, json: true }, function(err, response, profile) {

			if (req.header('Authorization')) {
				User.findOne({ linkedin: profile.id }, function(err, existingUser) {
					if (existingUser) {
						return res.status(409).send({ 
							message: msg.ERRORS.linkedin_account_belongs 
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
						user.linkedin = profile.id;
						user.picture = user.picture || profile.pictureUrl;
						user.displayName = user.displayName || profile.firstName + ' ' + profile.lastName;
						user.save(function () {
							var token = config.createJWT(user);
								res.send({ 
									token: token 
								});
						});
					});
				});
			} else {

				User.findOne({ linkedin: profile.id }, function(err, existingUser) {
					if (existingUser) {
						return res.send({ 
							token: config.createJWT(existingUser) 
						});
					}
					User.findOne({email : profile.emailAddress}, function (err, existingUser) {
						if(existingUser) {
							existingUser.linkedin = profile.id;
							existingUser.picture = profile.pictureUrl;
							existingUser.displayName = profile.firstName + ' ' + profile.lastName;
							existingUser.save(function () {
								var token = config.createJWT(existingUser);
								res.send({
									token: token,
									message : msg.ERRORS.same_email
								});
							});
						} else {

							var user = new User();
							user.linkedin = profile.id;
							user.email = profile.emailAddress;
							user.picture = profile.pictureUrl;
							user.displayName = profile.firstName + ' ' + profile.lastName;
							user.save(function () {
								var token = config.createJWT(user);
								res.send({ 
									token: token,
									profile : profile	
								});
							});
						}
					});
				});
			}
		});
	});
};
