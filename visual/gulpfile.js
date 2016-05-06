var gulp = require('gulp');
var sass = require('gulp-sass');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');

var context = {
  author: {firstName: "Alan", lastName: "Johnson"},
  body: "I Love Handlebars",
  comments: [{
    author: {firstName: "Yehuda", lastName: "Katz"},
    body: "Me too!"
  }]
};

var data = require('./test/json/totalSize.json');

gulp.task('html', function () {
	var templateData = data,
	options = {}

	return gulp.src('./index.handlebars')
		.pipe(handlebars(templateData, options))
		.pipe(rename('index.html'))
		.pipe(gulp.dest('dist'));
});

gulp.task('sass', function () {
  return gulp.src('./sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['html', 'sass']);
