var gulp = require('gulp'),
	sourcemaps = require('gulp-sourcemaps'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	watch = require('gulp-watch'),
	cssmin = require("gulp-cssmin"),
	rename = require("gulp-rename"),
	sourcemaps = require('gulp-sourcemaps');

	gulp.task('sass', function () {
		return gulp.src('./client/scss/**/*.scss')
			.pipe(sass())
			.pipe(autoprefixer({
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

	gulp.task('watch', function() {
    gulp.watch('./client/scss/**/*.scss', ['sass']);
});
	gulp.task('default', ['sass','watch']);
