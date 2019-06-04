'use strict';

var cssOutputStyle = ''; // '' (default) or 'compressed'
var cssSource = 'src/scss/site.scss';
var cssWatch = 'src/scss/*.scss';
var cssDest = '../../public/assets/styles/';
var localHost = 'http://rf.local';

var path = require('path');
var gulp = require('gulp');
var bsync = require('browser-sync');
var autoprefixer = require('autoprefixer');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cssnano = require('cssnano');


gulp.task('styles', function () {
  var browsers = [
    '> 1%',
    'last 2 versions',
    'Firefox ESR',
    'Opera 12.1'
  ];
  var sassOptions = {
    outputStyle: cssOutputStyle
  };
  var plugins = [
    autoprefixer({browsers: browsers})
  ];
  return gulp.src(cssSource)
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(gulp.dest(cssDest))
    .pipe(bsync.stream({match: "**/*.css"}));
});

gulp.task('browser-sync', function() {
	bsync.init({
		proxy: localHost,
		watchEvents: [ 'change', 'add', 'unlink', 'addDir', 'unlinkDir' ],
    files: ['assets/styles/*'],
    serveStatic: ['assets/styles']
	});
});

var build = gulp.parallel('styles',);
gulp.task('build', build);

gulp.task('watch', gulp.series('build', function() {
  gulp.watch(cssWatch, gulp.series('styles'));
}));

gulp.task('default',
	gulp.series('build',
		gulp.parallel('watch', 'browser-sync')));
