var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
	title: String,
	link: String,
	content: String,
	date: Date,
	img: String,
	currentSubscriptions: Number,
	totalSubscriptions: Number,
	feed: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Feed'
	}
});

mongoose.model('Article', articleSchema);