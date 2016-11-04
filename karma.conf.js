module.exports = function (config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine'],

		// list of files / patterns to load in the browser
		files: [
			"./client/bower_components/jquery/dist/jquery.min.js",
			"./client/bower_components/jquery-validation/dist/jquery.validate.min.js",
			"./client/bower_components/jquery-validation/dist/additional-methods.min.js",
			"./client/bower_components/bootstrap/dist/js/bootstrap.min.js",
			"./client/bower_components/angular/angular.min.js",
			"./client/bower_components/angular-animate/angular-animate.min.js",
			"./client/bower_components/angular-aria/angular-aria.min.js",
			"./client/bower_components/angular-messages/angular-messages.min.js",
			"./client/bower_components/angular-touch/angular-touch.min.js",
			"./client/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
			"./client/bower_components/angular-ui-router/release/angular-ui-router.min.js",
			"./client/bower_components/ng-file-upload/ng-file-upload.min.js",
			"./client/bower_components/ng-file-upload/ng-file-upload-shim.min.js",
			"./client/bower_components/angular-favicon/angular-favicon.min.js",
			"./client/bower_components/jpkleemans-angular-validate/dist/angular-validate.min.js",
			"./client/bower_components/angular-drag-and-drop-lists/angular-drag-and-drop-lists.min.js",
			"./client/bower_components/angular-socialshare/dist/angular-socialshare.min.js",
			"./client/bower_components/angular-scroll-animate/dist/angular-scroll-animate.js",
			"./client/bower_components/angular-mocks/angular-mocks.js",
			"./client/bower_components/angular-translate/angular-translate.min.js",
			"./client/bower_components/angular-translate-handler-log/angular-translate-handler-log.min.js",
			"./client/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js",
			"./client/bower_components/angular-cookies/angular-cookies.js",
    		"./client/bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js",
    		"./client/bower_components/angular-translate-storage-local/angular-translate-storage-local.js",

			"./client/js/app.min.js",

			"./client/bower_components/satellizer/dist/satellizer.min.js",
			"./client/bower_components/angular-jwt/dist/angular-jwt.min.js",
				
			"./tests/unit/registerNewUser.spec.js",
			"./tests/unit/profileController.spec.js",
			"./tests/unit/resetPassword.spec.js", 
			"./tests/unit/emailApproving.spec.js",
			"./tests/unit/dashboard.service.spec.js",
			"./tests/unit/feeds.service.spec.js",
			"./tests/unit/articles.service.spec.js"
		],

		// list of files to exclude
		exclude: [
		],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			"./client/js/app.js" : ['coverage']
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['spec', 'coverage'],
		coverageReporter: {
			type : 'html',
			dir : 'tests/coverage'
		},

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['Chrome'],

		browserify: {
			debug: true,
			transform: []
		},
		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,
		plugins: [
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			'karma-jasmine', 
			'karma-spec-reporter', 
			'karma-coverage'
		],
		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity
	})
}
