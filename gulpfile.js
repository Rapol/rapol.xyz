'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var minify = require('gulp-minify-css');

var dir = {
	sass: "./src/scss/**/*.scss",
	js: "./src/js/**/*.js",
	css: "./src/css/**/*.css",
}

var sassSrc = "./src/scss/app.scss"

// Default Task
gulp.task('default', ['watch', 'sass', 'css-minify', 'babel']);

gulp.task('sass', function() {
	return gulp.src(sassSrc)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('css-minify', function() {
	return gulp.src(dir.css)
		.pipe(minify())
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('babel', function(){
	return gulp.src(dir.js)
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', function(){
	gulp.watch(dir.sass, ['sass']);
	gulp.watch(dir.js, ['babel']);
});
