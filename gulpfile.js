'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
const babel = require('gulp-babel');

const sassDir = "./src/sass/**/*.scss";
const jsDir = "./src/js/**/*.js";

// Default Task
gulp.task('default', ['watch, sass, bable']);

gulp.task('sass', () => {
	gulp.src(sassDir)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('bable', () => {
	return gulp.src(jsDir)
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', () => {
	gulp.watch(sassDir, ['sass']);
	gulp.watch(jsDir, ['bable']);
});
