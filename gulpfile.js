/*
 * Gulp Build file for ufend-p8-neighbourhood-map
 * Project 8 - Udacity Front End Web Developer Nanodegree
 * refer to README.md for details
 *
 * Created by Roger Woodroofe rogyw@yahoo.co.nz
 *
 * references:
 * Udacity Web Tooling & Automation course (lesson 1 & 2)
 * https://www.udacity.com/course/viewer#!/c-ud892
 * Docs for each package
 * https://www.npmjs.com/
 */

"use strict";
// set jshint to ignore external node globals
/* jshint node: true */

/*
 * Specify Gulp Packages used
 */
var gulp = require('gulp');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
var ghPages = require('gulp-gh-pages');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var flatten = require('gulp-flatten');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var concat = require('gulp-concat');

/*
 * specify the src and destinatation folders
 */
var base = {
	src: './src/',
	bower: './bower_components/',
	output: './dist/'
};

/*
 * Specify the file locations and paths for project (relative to base.src)
 */
var paths = {
	css: ['css/**/*.css'],
	js: ['js/**/*.js'],
	jsExternal: ['js-external/**/*.js'],
	html: ['*.html'],
	images: ['img/**/*.+(png|jpg|jpeg|gif|svg)'],
	extras: ['*.+(md|ico|png)'],
	bower: ['bower_components/php-date-formatter/js/php-date-formatter.js',
		'bower_components/knockout/dist/knockout.js'
	]
};

/*
 * Gulp devlopment watch tasks for project
 */
gulp.task('default', function() {
	gulp.watch(base.src.concat(paths.css), ['styles']);
	gulp.watch(base.src.concat(paths.js), ['scripts']);
	gulp.watch(base.src.concat(paths.jsExternal), ['externaljs']);
	gulp.watch(base.src.concat(paths.images), ['images']);
	gulp.watch(base.src.concat(paths.html), ['html']);
	gulp.watch(base.src.concat(paths.extras), ['extras']);
	gulp.watch(base.bower.concat(paths.bower), ['bower']);
});

/*
 * CSS files task - styles
 */
gulp.task('styles', function() {
	return gulp.src(base.src.concat(paths.css), { base: base.src })
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(cssnano())
		.pipe(gulp.dest(base.output));
});

/*
 * Javascript files task - scripts
 */
gulp.task('scripts', function() {
	return gulp.src(base.src.concat(paths.js), { base: base.src })
		.pipe(concat('scripts.js'))
		.pipe(uglify())
		.pipe(gulp.dest(base.output + 'js/'));
});

/*
 * Javascript files task - debugscripts : includes sourcemaps for debug info
 */
gulp.task('debugscripts', function() {
	return gulp.src(base.src.concat(paths.js), { base: base.src })
		.pipe(sourcemaps.init())
		.pipe(concat('scripts.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(base.output + 'js/'));
});

/*
 * Javascript External files task - externaljs
 */
gulp.task('externaljs', function() {
	return gulp.src(base.src.concat(paths.jsExternal))
		.pipe(gulp.dest(base.output + 'js/'));
});

/*
 * External bower_components files needing to be copied to output - bower
 */
gulp.task('bower', function() {
	return gulp.src(paths.bower, { base: base.bower })
		.pipe(flatten())
		.pipe(gulp.dest(base.output.concat('js/')));
});

/*
 * Image files compression task - images
 */
gulp.task('images', function() {
	return gulp.src(base.src.concat(paths.images), { base: base.src })
		.pipe(imagemin())
		.pipe(gulp.dest(base.output));
});

/*
 * HTML files task - html
 */
gulp.task('html', function() {
	return gulp.src(base.src.concat(paths.html), { base: base.src })
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true,
			minifyJS: true,
			minifyCSS: true
		}))
		.pipe(gulp.dest(base.output));
});

/*
 * Other files needing to be copied to output - extras
 */
gulp.task('extras', function() {
	return gulp.src(base.src.concat(paths.extras))
		.pipe(gulp.dest(base.output));
});

/*
 * Delete all contents in dist output folder - clean:output
 * reference: https://css-tricks.com/gulp-for-beginners/
 */
gulp.task('clean:output', function() {
	return del.sync([base.output + '**']);
});

/*
 * Carry out all tasks to clear and build output folder - rebuild
 * reference: https://css-tricks.com/gulp-for-beginners/
 * Uses runSequence to ensure tasks completed in order.
 */
gulp.task('rebuild', function(callback) {
	runSequence('clean:output', ['styles', 'scripts', 'externaljs', 'images', 'html', 'extras', 'bower'],
		callback);
});

/*
 * Deploy output folder to GitHub gh-pages - deploy
 * reference: https://www.npmjs.com/package/gulp-gh-pages
 */
gulp.task('deploy', function() {
	return gulp.src(base.output + '**/*')
		.pipe(ghPages({ message: "chore: Update via gulp deploy [timestamp]" }));
});
