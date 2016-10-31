const gulp = require('gulp');
const del = require('del');
const plumber = require('gulp-plumber');
const connect = require('gulp-connect');
const pug = require('gulp-pug');
const pugInheritance = require('gulp-pug-inheritance');
const stylus = require('gulp-stylus');
const nib = require('nib');
const rupture = require('rupture');
const changed = require('gulp-changed');
const filter = require('gulp-filter');
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
    .pipe(pugInheritance({ basedir: 'src' }))
    .pipe(filter(file => (!/\/_/.test(file.path) && !/^_/.test(file.relative))))
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


gulp.task('cv', () => (
  gulp
    .src(['./src/CV_AlessioZappa.pdf'])
    .pipe(plumber())
    .pipe(gulp.dest('./dist'))
));


gulp.task('watch', () => {
  gulp.watch('./src/*.pug', ['layout']);
  gulp.watch('./src/css/*.styl', ['style']);
  gulp.watch('./src/CV_AlessioZappa.pdf', ['cv']);
});


gulp.task('deploy', () => (
  gulp
    .src([
      './dist/**/*',
      './CNAME',
    ])
    .deploy()
));


gulp.task('default', ['clean', 'layout', 'style', 'cv', 'watch', 'serve']);
gulp.task('deploy', ['default', 'deploy']);
