var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	moment = require('moment'),
	jwt = require('jwt-simple'),
	config = require('../../config/config'),
	emailConf = require('../../config/emailConf'),
	msg = require('../../config/msg'),
	request = require('request'),
	nev = require('email-verification')(mongoose),
	async = require('async'),
	bcrypt = require('bcryptjs'),
	flash = require('express-flash'),
	path = require('path'),
	emailToken, mailOptions, host, link, userEmail,
	arrayOfEmails = [];

module.exports.register = function (req, res) {
	var passAccepted = false;

	if (req.body.verifyEmail) {
		req.body.repPassword = req.body.password;
	}

	if (!req.body.email || !req.body.password || !req.body.repPassword) {
		return res.status(400).json({
			message: msg.ERRORS.fill_out_fields
		});
	}
	if (req.body.password !== req.body.repPassword) {
		return res.status(400).json({
			message: msg.ERRORS.pass_not_match
		});
	}
	if (config.regExp.test(req.body.password)) {
		passAccepted = true;
	}
	else {
		return res.status(400).json({
			message: msg.ERRORS.pass_not_match
		});
	}
	if (passAccepted) {

		User.findOne({ email: req.body.email }, function (err, existingUser) {

			if (!req.body.verifyEmail && req.body.counter === 0) {
				userEmail = req.body.email;
				emailToken = config.createEmailJWT(req.body.email);
				host = req.get('host');
				link = "http://" + req.get('host') + "/#/verify/" + emailToken;
				mailOptions = {
					to: req.body.email,
					subject: emailConf.nodemailer.confirm,
					html: "Hello,<br> Please Click on the <a href=" + link + ">link verification</a> to verify your email.<br>"
				}

				var user = new User({
					emailVerification: false,
					email: req.body.email,
					displayName: req.body.displayName,
					password: req.body.password,
					tempPassword: req.body.password,
					emailToken: emailToken
				});

				if (req.body.email !== arrayOfEmails[0]) {
					config.smtpTransport.sendMail(mailOptions, function (error, response) {
						if (error) {
							res.end("error");
						} else {
							arrayOfEmails.push(req.body.email);
							res.end("sent");
						}
					});
				}
				user.save(function (err, result) {
					if (err) {
						return res.status(400).json({
							message: msg.ERRORS.check_your_email	
						});
					}
					return res.status(400).json({
						message: msg.ERRORS.email_verification,
						user: user
					});
				});
			}

			if (existingUser && !req.body.verifyEmail && req.body.counter !== 0) {
				return res.status(400).json({
					message: msg.ERRORS.check_your_email
				});
			}
			if (existingUser && existingUser.verifiedUser && (!existingUser.google || !existingUser.facebook || !existingUser.twitter || !existingUser.linkedin)) {
				return res.status(409).json({
					message: msg.ERRORS.email_taken_or_not_approved
				});
			}

			if (existingUser && !existingUser.verifiedUser && req.body.verifyEmail) {
				existingUser.emailVerification = true;
				existingUser.verifiedUser = true;
				existingUser.date_of_signup = new Date();
				if ((req.body.password === existingUser.tempPassword) && (existingUser.emailToken === req.body.verifyEmail)) {
					existingUser.tempPassword = '';
					existingUser.save(function (err, result) {
						if (err) {
							res.status(500).json({
								message: err.message
							});
						}
						res.send({
							token: config.createJWT(result)
						});
					});
				} else {
					res.status(400).json({
						message: msg.ERRORS.pass_or_token_not_match
					});
				}
			}
		});
	}
};

module.exports.login = function (req, res) {
	User.findOne({
		email: req.body.email
	}, '+password', function (err, user) {
		if (!user) {
			return res.status(401).send({
				message: msg.ERRORS.invalid_data
			});
		}
		if (!user.emailVerification) {
			return res.status(401).send({
				message: msg.ERRORS.not_verifyed
			});
		}
		user.comparePassword(req.body.password, function (err, isMatch) {
			if (!isMatch) {
				return res.status(401).send({
					pwd: user.password,
					message: msg.ERRORS.invalid_data
				});
			}
			res.send({
				token: config.createJWT(user),
				user: user,
				message: msg.ERRORS.login 
			});
		});
	});
};

module.exports.forgotPass = function (req, res) {
	async.waterfall([
		function (done) {
			var token = config.createEmailJWT(req.body.email);
			done(null, token);
		},
	function (token, done) {
		User.findOne({ email: req.body.email }, function (err, user) {
			if (!user) {
				return res.status(404).send({
					message: msg.ERRORS.email_not_found
				});
			}
			user.resetPasswordToken = token;
			user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

			user.save(function (err) {
				done(err, token, user);
			});
		});
	},
	function (token, user, done) {
		var mailOptions = {
			to: user.email,
			from: 'passwordreset@demo.com',
			subject: 'Node.js Password Reset',
			html: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
			  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
			  '<a href="http://' + req.headers.host + '/#/reset/' + token + '">http://' + req.headers.host + '/#/reset/' + token + '</a>\n\n' +
			  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
		};
		config.smtpTransport.sendMail(mailOptions, function (err) {
			done(err, 'done');
		});
	}
	], function (err) {
		if (err) return next(err);
		res.status(200);
		return res.redirect('/#/forgot');
	});
};

module.exports.reset = function (req, res) {
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
		res.redirect('/#/reset/' + req.params.token);
	});
}

module.exports.resetPost = function (req, res) {
	var passRequirements = config.regExp;
	async.waterfall([
		function (done) {
			User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
				if (req.body.pas !== req.body.confirm) {
					return res.status(400).send({
						message: msg.ERRORS.pass_not_match
					})
				}
				if (!req.body.pas || !req.body.confirm) {
					return res.status(400).json({
						message: msg.ERRORS.fill_out_fields
					})
				}
				if (passRequirements.test(req.body.pas)) {
					user.password = req.body.pas;
					user.resetPasswordToken = undefined;
					user.resetPasswordExpires = undefined;

					user.save(function (err) {
						done(err, user);
					});
				} else {
					return res.status(400).json({
						message: msg.ERRORS.pass_not_match
					});
				}
			});
		},
		function (user, done) {
			var mailOptions = {
				to: user.email,
				from: 'rss.reader.app.ch.041@gmail.com',
				subject: 'Your password has been changed',
				text: 'Hello,\n\n' +
				'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
			};
			config.smtpTransport.sendMail(mailOptions, function (err) {
				done(err);
			});
		}
	], function (err) {
		res.redirect('/#/home');
	});
};

module.exports.changePassword = function (req, res, next) {
	if (!req.body.currentPass || !req.body.password || !req.body.newPassRepeat) {
		return res.status(400).json({
			message: msg.ERRORS.fill_out_fields
		});
	}

	if (req.body.password !== req.body.newPassRepeat) {
		return res.status(400).json({
			message: msg.ERRORS.pass_not_match
		});
	}
	if (req.body.password == req.body.newPassRepeat && req.body.password == req.body.currentPass) {
		return res.status(400).json({
			message: msg.ERRORS.same_pass
		});
	}

	User.findOne({
		email: req.body.email
	}, function (err, user) {
		if (user === undefined) {
			return res.status(400).json({
				message: msg.ERRORS.user_not_found
			});
		} else {
			if (req.body.currentPass) {
				user.password = req.body.password;

				user.save(function (err) {
					if (err) {
						return next(err);
					}
					res.status(200);
					res.json({
						"token": config.createJWT(user)
					});

				});
			} else {
				return res.status(400).json({
					message: msg.ERRORS.pass_incorrect
				});
			}
		}
	});
};