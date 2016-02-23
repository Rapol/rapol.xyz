'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');

var sassSrc = "./src/scss/app.scss"

var sassDir = "./src/scss/**/*.scss";
var jsDir = "./src/js/**/*.js";

// Default Task
gulp.task('default', ['watch', 'sass', 'babel']);

gulp.task('sass', function() {
	gulp.src(sassSrc)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('babel', function(){
	return gulp.src(jsDir)
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', function(){
	gulp.watch(sassDir, ['sass']);
	gulp.watch(jsDir, ['babel']);
});
