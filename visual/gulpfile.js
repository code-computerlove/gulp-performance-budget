var gulp = require('gulp');
var sass = require('gulp-sass');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');
var data = require('../test/json/allFiles.json');

gulp.task('handlebars', function () {
	var templateData = data,
	options = {}

	return gulp.src('./index.handlebars')
		.pipe(handlebars(templateData, options))
		.pipe(rename('index.html'))
		.pipe(gulp.dest('dist'));
});

gulp.task('styles', function () {
  return gulp.src('./sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['handlebars', 'styles'], function (cb) {
  gulp.watch('./index.handlebars', ['handlebars']),
  gulp.watch('./sass/*.scss', ['styles'])
});
