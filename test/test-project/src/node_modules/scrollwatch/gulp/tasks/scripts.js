'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var pkg = require('../../package.json');

gulp.task('scripts', ['clean'], function() {

	return gulp.src('./src/*.js')
		.pipe(plugins.umd())
		.pipe(plugins.rename({extname: '-' + pkg.version + '.js'}))
		.pipe(gulp.dest('./dist'))
		.pipe(plugins.rename({extname: '.min.js'}))
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.uglify())
		.pipe(plugins.header('/*! ' + pkg.name + ' v' + pkg.version + ' | (c) ' + (new Date().toString()) + ' ' + pkg.author + ' | License: ' + pkg.license + ' | ' + pkg.repository.url + '*/\n'))
		.pipe(plugins.sourcemaps.write('./'))
		.pipe(gulp.dest('./dist'));

});
