/* Gulp Build file for ufend-p8-neighbourhood-map
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

/* Specify Gulp Packages used
 */
var gulp = require('gulp');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
var ghPages = require('gulp-gh-pages');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var runSequence = require('run-sequence');
var del = require('del');

/* specify the file locations and paths for project
 */
var paths= {
  css: ['./css/**/*.css'],
  js: ['./js/**/*.js'],
  html:['./*.html'],
  images: ['./img/**/*.+(png|jpg|jpeg|gif|svg)'],
  extras: ['./*.+(md|ico)'],
  output: './dist/'
};

/* Gulp devlopment watch tasks for project
 */
gulp.task('default', function() {
  gulp.watch(paths.css, ['styles']);
  gulp.watch(paths.js, ['scripts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.extras, ['extras']);
});

/* CSS files task - styles
 */
gulp.task('styles', function() {
  return gulp.src(paths.css, {base: './'})
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(cssnano())
    .pipe(gulp.dest(paths.output));
});

/* Javascript files task - scripts
 */
gulp.task('scripts', function() {
  return gulp.src(paths.js, {base: './'})
    .pipe(uglify())
    .pipe(gulp.dest(paths.output));
});

/* Image files compression task - images
 */
gulp.task('images', function() {
  return gulp.src(paths.images, {base: './'})
    .pipe(imagemin())
    .pipe(gulp.dest(paths.output));
});

/* HTML files task - html
 */
gulp.task('html', function() {
  return gulp.src(paths.html, {base: './'})
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true,
      minifyCSS: true
    }))
    .pipe(gulp.dest(paths.output));
});

/* Other files needing to be copied to output - extras
 */
gulp.task('extras', function(){
  return gulp.src(paths.extras)
    .pipe(gulp.dest(paths.output));
});

/* Delete all contents in dist output folder - clean:output
 * reference: https://css-tricks.com/gulp-for-beginners/
 */
gulp.task('clean:output', function(){
  return del.sync([paths.output + '**'])
});

/* Carry out all tasks to clear and build output folder - rebuild
 * reference: https://css-tricks.com/gulp-for-beginners/
 * Uses runSequence to ensure tasks completed in order.
 */
gulp.task('rebuild', function(callback){
  runSequence('clean:output',
              ['styles','scripts','images','html','extras'],
              callback)
});

/* Deploy output folder to GitHub gh-pages - deploy
 * reference: https://www.npmjs.com/package/gulp-gh-pages
 */
gulp.task('deploy', function() {
  return gulp.src(paths.output + '**/*')
    .pipe(ghPages({message: "chore: Update via gulp deploy [timestamp]" }));
});
