var moment = require('moment'),
	jwt = require('jwt-simple'),
	nodemailer = require('nodemailer');


module.exports = {
	MONGO_URI: process.env.MONGO_URI || 'localhost',
	TOKEN_SECRET: process.env.TOKEN_SECRET || '496c59a0260a0c999ae39eccdff5ff03_rss',

	// OAuth 2.0
	FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || '413152de5ff6197790927d4052263ab1',
	GOOGLE_SECRET: process.env.GOOGLE_SECRET || 'pGT_4I5yjrhPGyohUyTEKsqe',

	LINKEDIN_SECRET: process.env.LINKEDIN_SECRET || '7pYAnN0nJf8ZiDVB',
	// OAuth 1.0
	TWITTER_KEY: process.env.TWITTER_KEY || 'dMtO7Tp6iLeG1xI1cknfuwMQd',
	TWITTER_SECRET: process.env.TWITTER_SECRET || '9ld2ELLenIzJCVYICQwhqFkAtALYijgypuAomgsDer1FzCX62E',
	
	regExp: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/,
	
	createJWT: function (user) {
		var payload = {
			sub: user._id,
			email: user.email,
			iat: moment(),
			exp: moment().add(1, 'days')
		};
		return jwt.encode(payload, this.TOKEN_SECRET);
	},
	createEmailJWT: function (email) {
	var payload = {
		verifEmail: email,
		iat: moment(),
		exp: moment().add(1, 'hours')
	};
	return jwt.encode(payload, this.TOKEN_SECRET);
	},
	
	smtpTransport : nodemailer.createTransport("SMTP",{
	service: "Gmail",
		auth: {
			user: 'rss.reader.app.ch.041@gmail.com',
			pass: 'rssreader'
		}
	})

}