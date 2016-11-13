var mongoose = require('mongoose'),
	jwt = require('jwt-simple'),
	bcrypt = require('bcryptjs'),
	config = require('../config/config'),

	userSchema = new mongoose.Schema({
		email: {
			type: String,
			unique: true,
			required: true
		},
		password: { type: String, select: true },
		tempPassword: {type: String},
		admin: Boolean,
		date_of_signup : {type : Date},
		emailToken : String,
		emailVerification: { type : Boolean },
		verifiedUser : {type : Boolean},
		resetPasswordToken: String,
		resetPasswordExpires: Date,
		displayName: String,
		picture : String,
		facebook: String,
		google: String,
		twitter: String,
		linkedin: String,
		hash: String,
		salt: String,
		avatar: String,
		colorTheme: {
			type: String,
			default: "theme1"
		},
		categories: [String],
		favCategories: [String],
		feedsDictionary: [{category: String, feeds: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Feed'
			}]
		}],
		favouritesDictionary: [{
			category: String, articles: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Article'
			}]
		}]
	});

userSchema.pre('save', function(next) {
	var user = this;
		if (!user.isModified('password')) {
			return next();
		}
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(user.password, salt, function(err, hash) {
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.setPassword = function (password) {
	this.salt = bcrypt.genSaltSync(10);
	this.hash = bcrypt.hashSync(password, this.salt);

};

userSchema.methods.validPassword = function (password) {
	var hash = bcrypt.genSaltSync(10);
	return this.hash === hash;
};

mongoose.model('User', userSchema);
