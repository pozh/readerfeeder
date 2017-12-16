'use strict';

var gulp = require('gulp');
var bsync = require('browser-sync');
var autoprefixer = require('autoprefixer');
var watch = require('gulp-watch');
var cssnano = require('cssnano');

var $ = require('gulp-load-plugins')();


gulp.task('styles', function () {
  var browsers = [
    '> 1%',
    'last 2 versions',
    'Firefox ESR',
    'Opera 12.1'
  ];
  var sassOptions = {
    includePaths: [
      'node_modules/bootstrap/scss/',
    ]
   //,outputStyle: 'compressed'
  };
  var plugins = [
    autoprefixer({browsers: browsers}),
    cssnano()
  ];
  return gulp.src('./resources/assets/sass/app.scss')
    .pipe($.sass(sassOptions).on('error', $.sass.logError))
    .pipe($.postcss(plugins))
    .pipe(gulp.dest('./public/assets/css/'))
    .pipe(bsync.reload({stream: true}));
});


gulp.task('images', function() {
  return gulp.src('resources/assets/images/**/*')
    .pipe($.imagemin())
    .pipe(gulp.dest('public/assets/images/'));
});


gulp.task('browser-sync', function() {
  bsync({
    //server: {baseDir: './dist/'},
    ghostMode: true,
    proxy: "rf.local",
    notify: false
  });
});


gulp.task('watch', ['build'], function() {
  gulp.watch('resources/assets/images/*', ['images']);
  gulp.watch('resources/assets/sass/*', ['styles']);
  //gulp.watch('src/assets/js/*', ['js']);
  gulp.start('browser-sync');
});


gulp.task('build', ['styles', 'images']);


gulp.task('default', ['build'], function() {
gulp.start('watch');

});
