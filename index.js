'use strict';
var express = require('express'),
	fs = require("fs"),
	app = express(),
	session = require('express-session'),
	bodyParser = require('body-parser'),
	favicon = require('serve-favicon'),
	path = require('path'),
	morgan = require('morgan'),
	multer = require('multer'),
	cors = require('cors'),
	logger = require('morgan'),
	User = require('./server/models/Users'),
	mongoose = require('mongoose'),
	flash = require('express-flash');

app.use(favicon(path.join(__dirname, 'server', 'assets', 'images', 'favicon.ico')));
require('./server/models/Feeds');
require('./server/models/Articles');
require('./server/models/Users');
require('./server/models/Advised');

var routes = require('./server/routes/index');

app.set('port', process.env.PORT || 8080);
app.set('base url', process.env.URL || 'http://localhost');

mongoose.connect(process.env.DB_URL || 'mongodb://feedsUser:Ch-041feedsUser@ds044979.mlab.com:44979/feeds');
mongoose.connection.on('error', function (err) {
	console.log('Error: Could not connect to MongoDB');
});
app.use(cors());
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', process.env.allowOrigin || 'http://localhost');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(express.static(__dirname + '/dist'));
app.use('/', function(req,res) {
	res.send({
		message: 'ok'
	})
});

app.listen(app.get('port'));
module.exports = app;
