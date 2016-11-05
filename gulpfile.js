var exec = require('child_process').exec,
	gulp = require('gulp'),
	sourcemaps = require('gulp-sourcemaps'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	useref = require('gulp-useref'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	gulpUtil = require('gulp-util'),
	watch = require('gulp-watch'),
	cssmin = require("gulp-cssmin"),
	rename = require("gulp-rename"),
	sourcemaps = require('gulp-sourcemaps'),
	ngAnnotate = require('gulp-ng-annotate'),
	mkdirp = require('mkdirp');

mkdirp.sync('./dist/uploads', function (err) {
	if (err) console.error(err);
});

gulp.task('server', function (cb) {
	});
	console.log("Server is running on port 8080");
	exec('npm start', function (err, stdout, stderr) {
		console.log(stdout, stderr);
		cb(err);
	});
});
gulp.task('main', ['build'], function () {
	gulp.watch('./client/partials/**/*.html', { interval: 500 }, ['build']);
	gulp.watch('./client/scss/**/*.scss', { interval: 500 }, ['build']);
	gulp.watch(['./client/js/**/*.js', '!./client/js/**/*.spec.js', '!./client/js/app.min.js', '!./client/js/app.js'], { interval: 500 }, ['build']);
});

gulp.task('sass', function () {
	return gulp.src('./client/scss/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['> 1%', 'IE 7'],
			cascade: true
		}))
		.pipe(gulp.dest('dist/css'))
		.pipe(sourcemaps.init())
		.pipe(cssmin())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./client/css'));
});

gulp.task('scripts', function () {
	return gulp.src(['./client/js/**/*.js', '!./client/js/**/*.spec.js', '!./client/js/app.min.js', '!./client/js/app.js'])
		.pipe(concat('app.js'))
		.pipe(gulp.dest('./client/js/'))
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(sourcemaps.write())
		.on('error', function (e) {
			console.log(e);
		})
		.pipe(gulp.dest('./client/js/'));
});

gulp.task('useref', function () {
	return gulp.src('client/*.html')
		.pipe(useref())
		.pipe(gulp.dest('./dist/'));
});

gulp.task('build', ['scripts', 'sass'], function () {
	gulp.src('client/scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('dist/css/'));

	gulp.src(['client/partials/**/*.html'])
		.pipe(gulp.dest('dist/partials/'));

	gulp.src(['client/assets/**'])
		.pipe(gulp.dest('dist/assets/'));

	gulp.src(['client/fonts/**'])
	.pipe(gulp.dest('dist/fonts/'));

	gulp.src(['client/css/**'])
		.pipe(gulp.dest('./dist/css/'));

	gulp.src(['client/translation/**'])
		.pipe(gulp.dest('./dist/translation/'));

	gulp.src(['client/bower_components/flag-icon-css/flags/**'])
		.pipe(gulp.dest('./dist/flags/'));

	gulp.src(['client/scripts/**/*.js'])
		.pipe(ngAnnotate({
			add: true
		}));
	gulp.src(['client/index.html'])
		.pipe(sourcemaps.init())
		.pipe(useref())
		.pipe(gulp.dest('./dist/'))
		.pipe(sourcemaps.write());
});
gulp.task('default', ['server', 'main']);
