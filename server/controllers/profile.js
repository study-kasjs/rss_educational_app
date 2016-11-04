var multer = require('multer'),
	fs = require('fs'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	config = require('../config/config'),
	msg = require('../config/msg'),
	storage = multer.diskStorage({ 
		destination: function(req, file, cb) {
			cb(null, './dist/uploads/');
		},
		filename: function(req, file, cb) {
			var datetimestamp = Date.now();
			cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
		}
	});

var upload = multer({ 
	storage: storage
}).single('file');

/** API path that will upload the files */
module.exports.upload = function(req, res) {
	upload(req, res, function(err) {
		if (req.file) {
			var fileName = req.file.filename;
			try {
				fs.unlinkSync('dist/' + req.user.avatar);
			} catch (e) {
				console.log(err);
			}
			req.user.avatar = "uploads/" + fileName;
			req.user.save(function(err, user) {
				res.json({ error_code: 0, err_desc: null });
			});
			if (err) {
				res.json({ error_code: 1, err_desc: err });
				return;
			}
		} else return res.status(500).json({
			message: msg.ERRORS.file_not_found
		});
	});
};

module.exports.changeColorTheme = function(req, res) {
	req.user.colorTheme = req.body.colorTheme;
	req.user.save(function(err, user) {
		if (err) {         
			res.json({
				error_code: 1,
				err_desc: err
			});         
			return;       
		}           
		res.json({
			error_code: 0,
			err_desc: null
		}); 
	});      
};