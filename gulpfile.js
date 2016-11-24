const gulp = require('gulp');
const babel = require('gulp-babel');
const del = require('del');
const typescript = require('typescript');
const sourcemaps = require('gulp-sourcemaps');
const tsconfig = require('./tsconfig.json');

// Clean output directory
gulp.task('clean', function () {
  return del('build/**/*');
});

// Copy dependencies
gulp.task('copy:libs', ['clean'], function () {
  return gulp.src([
    'node_modules/angular2/bundles/angular2-polyfills.js',
    'node_modules/angular2/bundles/angular2.js',
    'node_modules/angular2/bundles/router.js'
  ])
    .pipe(gulp.dest('build/lib'));
});

// Copy HTML
gulp.task('copy:html', ['clean'], function () {
  return gulp.src(['src/app/**/*.html'])
    .pipe(gulp.dest('build/pages'));
});

// Compile typescript
gulp.task('compile-frontend', ['clean'], function () {
  return gulp
    .src('src/app/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(typescript(tsconfig.compilerOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/app'));
});

// Compile node
gulp.task('compile-backend', ['clean'], function () {
  return gulp.src('src/server/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('build/server'));
});

// Compile server
gulp.task('compile-server', function () {
  return gulp.src('server.js')
    .pipe(babel())
    .pipe(gulp.dest('build'));
});

// Set some defaults
gulp.task('build', ['copy:html', 'compile-frontend', 'compile-backend', 'compile-server']);
gulp.task('default', ['build']);
