const gulp = require('gulp');
const del = require('del');
const plumber = require('gulp-plumber');
const connect = require('gulp-connect');
const pug = require('gulp-pug');
const stylus = require('gulp-stylus');
const nib = require('nib');
const rupture = require('rupture');
const changed = require('gulp-changed');
const deploy = require('gulp-gh-pages');


gulp.task('clean', (cb) => {
  del.sync(['./dist/'], cb);
});


gulp.task('serve', () => (
  connect.server({
    root: './dist',
    livereload: true,
    host: '0.0.0.0',
    port: process.env.PORT || 1337,
  })
));


gulp.task('layout', () => (
  gulp
    .src([
      './src/*.pug',
    ])
    .pipe(changed('./dist', { extension: '.html' }))
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload())
));


gulp.task('style', () => (
  gulp
    .src([
      './src/css/*.styl',
    ])
    .pipe(changed('./dist/css', { extension: '.css' }))
    .pipe(plumber())
    .pipe(
      stylus({
        compress: true,
        use: [
          nib(),
          rupture(),
        ],
      })
    )
    .pipe(gulp.dest('./dist/css'))
    .pipe(connect.reload())
));


gulp.task('watch', () => {
  gulp.watch('./src/*.pug', ['layout']);
  gulp.watch('./src/css/*.styl', ['style']);
});


gulp.task('deploy', () => (
  gulp
    .src([
      './dist/**/*',
      './CNAME',
    ])
    .deploy()
));


gulp.task('default', ['clean', 'layout', 'style', 'watch', 'serve']);
gulp.task('deploy', ['default', 'deploy']);
